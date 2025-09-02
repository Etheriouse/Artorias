const utils = require('../utils');
const path = require('path');
const fs = require('fs');
const { createChildWindow, openFile } = require('../window');

const crypto = require('crypto-js');
const ical = require('ical');
const { app } = require('electron')

const event_ = JSON.parse(fs.readFileSync(path.join(app.getPath('userData'), 'calendar/event.json'), 'utf-8'));
const person_ = JSON.parse(fs.readFileSync(path.join(app.getPath('userData'), 'calendar/person.json'), 'utf-8'));
const color_event = JSON.parse(fs.readFileSync(path.join(app.getPath('userData'), 'calendar/color_event.json'), 'utf-8'));

var uid_;

if (person_.length < 1) {
    addPerson(
        {
            name: "admin",
            surname: "superadmin",
            age: -1,
            phone: -1
        }
    )
}

function generateUUIDv4() {
    const randomBytes = crypto.lib.WordArray.random(16);

    let hex = randomBytes.toString(crypto.enc.Hex);

    hex = hex.substring(0, 32);

    const uuid = hex.substring(0, 8) + '-' +
        hex.substring(8, 12) + '-' +
        '4' + hex.substring(13, 16) + '-' +  // version 4
        ((parseInt(hex.substring(16, 17), 16) & 0x3) | 0x8).toString(16) + hex.substring(17, 20) + '-' +
        hex.substring(20, 32);

    return uuid;
}

function exporthasics() {
    try {
        const escapeICS = (str) =>
            String(str)
                .replace(/\\n/g, "\\n")
                .replace(/,/g, "\\,")
                .replace(/;/g, "\\;")
                .replace(/\r?\n/g, "\\n");

        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
        };

        const getNameByUID = (uid) => {
            const user = person_.find(u => u.uid === uid);
            return user ? `${user.name} ${user.surname}` : uid;
        };

        const lines = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//Artorias Tools//FR"
        ];

        for (const e of event_) {
            lines.push("BEGIN:VEVENT");
            lines.push(`UID:${e.uid}`);
            lines.push(`DTSTAMP:${formatDate(e["last-write"])}`);
            lines.push(`DTSTART:${formatDate(e.start)}`);
            lines.push(`DTEND:${formatDate(e.end)}`);
            lines.push(`SUMMARY:${escapeICS(e.name)}`);
            lines.push(`DESCRIPTION:${escapeICS(e.description)}`);
            lines.push(`LOCATION:${escapeICS(e.location)}`);
            lines.push(`CATEGORIES:${escapeICS(e.categorie)}`);
            lines.push(`ORGANIZER;CN="${getNameByUID(e.organizer)}":MAILTO:${e.organizer}`);

            if (e.members) {
                for (const member of e.members) {
                    const name = getNameByUID(member);
                    lines.push(`ATTENDEE;CN="${name}";RSVP=TRUE:MAILTO:${member}`);
                }
            }
            lines.push("END:VEVENT");
        }

        lines.push("END:VCALENDAR");

        const icsContent = lines.join("\r\n");
        console.log(path.join(app.getPath('userData'), 'calendar/event.ics'))
        fs.writeFileSync(path.join(app.getPath('userData'), 'calendar/event.ics'), icsContent, 'utf-8');
        return { ok: true }
    } catch (err) {
        console.log(err)
        return { ok: false };
    }
}

async function importfromics() {
    const result = await openFile('ics');
    if (result.ok) {
        import__(result.filepath);
        return { ok: true };
    } else {
        return { ok: false };
    }
}

function import__(file) {
    try {
        const ics = ical.parseFile(file);
        const events_list = [];
        for (const uid in ics) {
            var uid_giv = "none"
            if(ics[uid].organizer) {
                uid_giv = addPerson({ name: ics[uid].organizer, surname: '', age: '', phone: '' });
            }
            var uidOfEvent;
            if (!uid.includes('@')) {
                uidOfEvent = generateUUIDv4() + '@artorias.souls';
            } else {
                uidOfEvent = uid;
            }

            if(ics[uid].summary === "Pause déjeuner") {
                continue;
            }
            console.log(uidOfEvent)
            events_list.push(
                {
                    name: ics[uid].summary || '',
                    description: ics[uid].description.replace(/^\n+/, '').replace(/\(Modifié le:.*?\)\s*$/, '').replaceAll('\n', '<br>') || '',
                    location: ics[uid].location || '',
                    categorie: ics[uid].categories || '',
                    organizer: uid_giv || '',
                    start: new Date(ics[uid].start).toString() || '',
                    end: new Date(ics[uid].end).toString() || '',
                    "last-write": (!ics[uid].lastmodified) ? new Date().toString() : new Date(ics[uid].lastmodified).toString(),
                    uid: uidOfEvent

                }
            )
        }
        events_list.forEach(event => {
            registerevent(event);
        })
    } catch (err) {
        //console.error(err);
        return undefined
    }
}

function findevent(uid) {
    const index = event_.findIndex(e => e.uid === uid);
    if (index !== -1) {
        return event_[index];
    } else {
        return index;
    }
}

function registerevent(event) {
    if (!event.uid) {
        event.uid = generateUUIDv4() + '@artorias.souls';
    }
    const index = event_.findIndex(e => e.uid === event.uid);
    if (index !== -1) {
        event_[index] = event;
    } else {
        event_.push(event);
    }
    save_event();
}

function modifyevent(event) {
    const index = event_.findIndex(e => e.uid === event.data.uid);
    if (index !== -1) {
        event_[index] = event.data;
    }
    save_event();
}

function deleteevent(uid) {
    const index = event_.findIndex(e => e.uid === uid);
    if (index !== -1) {
        event_.splice(index, 1);
        return { ok: true };
    }
    return { ok: false, error: "event not found" };
}

function save_event() {
    fs.writeFileSync(path.join(app.getPath('userData'), 'calendar/event.json'), JSON.stringify(event_));
}

function save_color_event() {
    console.log(color_event);
    console.log(JSON.stringify(color_event))
    fs.writeFileSync(path.join(app.getPath('userData'), 'calendar/color_event.json'), JSON.stringify(color_event));
}

function save_person() {
    fs.writeFileSync(path.join(app.getPath('userData'), 'calendar/person.json'), JSON.stringify(person_));
}


function getevent_() {
    if (typeof uid_ === 'string' && uid_.includes('@')) {
        return findevent(uid_);
    } else {
        return uid_;
    }
}

function getperson() {
    return person_;
}

function getperson_uid(uid = uid_) {
    const index = person_.findIndex(e => e.uid === uid);
    if (index !== -1) {
        return person_[index]
    }
    return undefined;
}

async function modifyeventwindow(uid) {
    uid_ = uid;
    let modifywindow = createChildWindow('tools/calendar/modify', true, { width: 1050, height: 700 }, false, 'event.png');

    const eventModPromise = new Promise((resolve) => {
        resolveEventModPromise = resolve;
    })

    const result = await eventModPromise;
    modifywindow.close();
    modifywindow = null;
    return result;
}

function confirmmodifyevent(event) {
    resolveEventModPromise({ "ok": true })
    modifyevent(event);
    return true;
}

async function addeventwindow(event) {
    uid_ = event;
    let addwindow = createChildWindow('tools/calendar/add', true, { width: 1050, height: 700 }, false, 'event.png');

    const eventAddPromise = new Promise((resolve) => {
        resolveEventAddPromise = resolve;
    })

    const result = await eventAddPromise;
    addwindow.close();
    addwindow = null;
    return result;
}

async function confirmaddevent(event) {
    resolveEventAddPromise({ "ok": true, 'event': event })
    registerevent(event.data);
    return true;
}

function isOnThisDay(evdate, dayneed) {
    const eventDate = new Date(evdate);
    return (
        eventDate.getFullYear() === dayneed.getFullYear() &&
        eventDate.getMonth() === dayneed.getMonth() &&
        eventDate.getDate() === dayneed.getDate()
    );
}

function isOnThisWeek(evdate, monday) {
    let is = false;
    for (let i = 0; i < 7; i++) {
        is = is || isOnThisDay(evdate, new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i));
    }
    return is;
}

function geteventday(year, month, day_) {
    const events = [];
    var date = new Date(year, month, day_);
    for (const i in event_) {
        if (isOnThisWeek(event_[i].start, date) || isOnThisWeek(event_[i].end, date)) {
            events.push(event_[i]);
        }
    }
    return events;
}


async function addpersonwindow() {
    let addwindow = createChildWindow('tools/calendar/add-person', true, { width: 550, height: 475 }, false, 'person.png');

    const personAddPromise = new Promise((resolve) => {
        resolvePersonAddPromise = resolve;
    })

    const result = await personAddPromise;
    addwindow.close();
    addwindow = null;
    return result;
}

function confirmaddperson(person) {
    resolvePersonAddPromise({ "ok": true })
    addPerson(person);
    return true;
}

function addPerson(person) {
    if (!person.uid) {
        person.uid = generateUUIDv4() + '@artorias.souls';
    }
    const index = person_.findIndex(e => e.uid === person.uid);
    if (index !== -1) {
        person_[index] = person;
    } else {
        person_.push(person);
    }
    save_person();
    return person.uid;
}

async function modifypersonwindow(uid) {
    uid_ = uid;
    let modifywindow = createChildWindow('tools/calendar/modify-person', true, { width: 550, height: 475 }, false, 'person.png');

    const personModPromise = new Promise((resolve) => {
        resolvePersonModPromise = resolve;
    })

    const result = await personModPromise;
    modifywindow.close();
    modifywindow = null;
    return result;
}

function confirmmodifyperson(person) {
    resolvePersonModPromise({ "ok": true })
    modifyPerson(person);
    return true;
}

function modifyPerson(person) {
    const index = person_.findIndex(e => e.uid === person.uid);
    if (index !== -1) {
        person_[index] = person;
    }
    save_person();
}

function deletePerson(uid) {
    const index = person_.findIndex(e => e.uid === uid);
    if (index !== -1) {
        person_.splice(index, 1);
    }
    event_.forEach(event => {
        const indexMember = event.members.findIndex(e => e.uid === uid);
        if (index !== -1)
            event.members.splice(indexMember, 1);
        if (event.organizer === uid) {
            event.organizer = '';
        }
    })
}

function randomHexColor() {
    return "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
}


function getColorOfEventByName(name) {
    const key = Object.keys(color_event).find(k => name.includes(k));

    if (!key) {
        const newColor = randomHexColor();
        const shortName = String(name).split(" ")[0];
        color_event[shortName] = newColor; 
        return { ok: true, color: newColor };
    }



    return { ok: true, color: key ? color_event[key] : null };
}


module.exports = { registerevent, save_event, save_person, save_color_event, modifyeventwindow, addeventwindow, confirmaddevent, getevent_, geteventday, confirmmodifyevent, deleteevent, importfromics, getperson, addpersonwindow, confirmaddperson, modifypersonwindow, confirmmodifyperson, getperson_uid, deletePerson, exporthasics, getColorOfEventByName }