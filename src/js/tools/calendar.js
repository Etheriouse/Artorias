const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var time_travel = 0;
var today, week, week_number;
let slot_clicked;
let event_clicked;

import { setupPerson, get_name_by_uid } from "./calendaroption.js"
setupPerson();

async function setup() {
    await load_cache();
    today = get_day_();
    week = get_week();

    document.getElementById('short-week-name').innerHTML = `${(week[0].day < 10 ? '0' : '') + week[0].day}-${(week[6].day < 10 ? '0' : '') + week[6].day} ${months[today.month]}`;
    week_number = getWeekNumber(today);
    var date_week;
    if (week_number >= 53) {
        date_week = `${today.years - 1}-W${(week_number < 10 ? '0' : '') + week_number}`;
    } else {
        date_week = `${today.years}-W${(week_number < 10 ? '0' : '') + week_number}`;
    }
    console.log(date_week)
    document.getElementById('select-week-input').value = date_week;

    setup_calendar();

    document.getElementById('calendar').style.display = 'flex';
    document.getElementById('loading').style.display = 'none';
    document.getElementById('grid').scrollTop = (new Date().getHours() * 100 + ((new Date().getMinutes() / 60) * 100))
    document.getElementById('time-now').style.height = `${(new Date().getHours() * 100 + ((new Date().getMinutes() / 60) * 100)) }px`;

}

document.getElementById('going-today-button').addEventListener('click', () => {
    time_travel = 0;
    timetravel_update(0);
})

setup()

async function load_cache() {
    time_travel = await window.api.getcache('tools/calendar/time-travel');
    if (!time_travel) {
        time_travel = 0;
    }
    console.log(time_travel)
}

function get_week() {
    let array = [];

    for (let i = 0; i < 7; i++) {
        array.push(get_day_(i - today.daysweek))
    }
    return array;
}

function getWeekNumber(date) {
    const d = new Date(date.years, date.month, date.day);
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return weekNo;
}

function getDayOfWeek(day) {
    return day === 0 ? 7 : day;
}

function get_day_(moving = 0) {
    const this_week = new Date();
    this_week.setDate(this_week.getDate() + moving + time_travel);
    return { daysweek: getDayOfWeek(this_week.getDay()) - 1, day: this_week.getDate(), month: this_week.getMonth(), years: this_week.getFullYear() };
}

async function get_event_day(dayy) {
    const result = await window.api.geteventday(dayy.years, dayy.month, dayy.day);
    var events = [];
    result.forEach(event => {
        calculateEventNDay(event).forEach(splitevent => {
            events.push(splitevent);
        })
    })
    events = parseWeek(events);
    calculateEventRender(events);
    events.forEach(event => {
        render_event(event);
    })
}

function calculateEventRender(events) {
    events.forEach(event => {
        event.startDate = new Date(event.start);
        event.endDate = new Date(event.end);
        event.totalColumns = 1;
    });

    const sortedEvents = [...events].sort((a, b) => a.startDate - b.startDate);

    const columns = [];

    sortedEvents.forEach(event => {
        let placed = false;

        for (let col = 0; col < columns.length; col++) {
            const lastInCol = columns[col][columns[col].length - 1];
            if (event.startDate >= lastInCol.endDate) {
                columns[col].push(event);
                event.offset = col;
                placed = true;
                break;
            }
        }

        if (!placed) {
            columns.push([event]);
            event.offset = columns.length - 1;
        }
    });

    events.forEach(event => {
        const overlapGroup = new Set();

        function dfs(e) {
            if (overlapGroup.has(e)) return;
            overlapGroup.add(e);

            events.forEach(other => {
                if (e === other) return;

                const overlap =
                    !(e.endDate <= other.startDate || e.startDate >= other.endDate);

                if (overlap) {
                    dfs(other);
                }
            });
        }

        dfs(event);

        const maxOffset = Math.max(...[...overlapGroup].map(e => e.offset));
        const widthRatio = 1 / (maxOffset + 1);

        event.widthRatio = parseFloat(widthRatio.toFixed(2));
        event.totalColumns += maxOffset;
    });

    return events;
}

function parseWeek(events) {
    const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.start).getDate();
        const lowerBound = get_day_(-today.daysweek).day;
        const upperBound = get_day_(7 - today.daysweek).day;

        return !(lowerBound > eventDate || upperBound <= eventDate);
    });
    return filteredEvents;
}

function calculateEventNDay(event) {
    const events = [];

    const start = new Date(event.start);
    const end = new Date(event.end);

    let current = new Date(start);

    while (current.toDateString() !== end.toDateString()) {
        const endOfDay = new Date(current);
        endOfDay.setHours(23, 59, 59, 999);

        events.push({
            ...event,
            start: new Date(current),
            end: new Date(endOfDay)
        });

        current.setDate(current.getDate() + 1);
        current.setHours(0, 0, 0, 0);
    }

    events.push({
        ...event,
        start: new Date(current),
        end: new Date(end)
    });
    return events;
}

function setup_calendar() {

    week.forEach(d => {
        const day = document.createElement('div');
        day.className = "day";
        if (d.daysweek === (today.daysweek)) {
            day.id = 'today';
        }

        for (let i = 0; i < 24; i++) {
            const demi_hour = document.createElement('div');
            demi_hour.className = "bothour";
            const demi_hour2 = document.createElement('div');
            demi_hour2.className = "tophour"

            demi_hour.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                document.getElementById('context-menu-add').style.display = 'block';
                document.getElementById('context-menu-modify').style.display = 'none';
                menu.style.top = `${e.pageY}px`;
                menu.style.left = `${e.pageX}px`;
                menu.style.display = 'block';
                slot_clicked = { start: new Date(d.years, d.month, d.day, i, 0), end: new Date(d.years, d.month, d.day, i + 1, 0) }
                console.log(slot_clicked);
            });

            demi_hour2.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                document.getElementById('context-menu-add').style.display = 'block';
                document.getElementById('context-menu-modify').style.display = 'none';
                menu.style.top = `${e.pageY}px`;
                menu.style.left = `${e.pageX}px`;
                menu.style.display = 'block';
                slot_clicked = { start: new Date(d.years, d.month, d.day, i, 30), end: new Date(d.years, d.month, d.day, i + 1, 30) }
                console.log(slot_clicked);

            });

            day.appendChild(demi_hour)
            day.appendChild(demi_hour2)

        }
        document.getElementById('content').appendChild(day)

    })

    for (let i = 0; i < 24; i++) {
        const divhour = document.createElement('div');
        const hour = document.createElement('h3');
        if (i < 10) {
            hour.innerHTML = '0';
        }
        hour.innerHTML += i;
        divhour.appendChild(hour)
        document.getElementById('side-content').appendChild(divhour)
    }

    const titleday = document.getElementById('day-title');

    week.forEach(day => {
        const divday = document.createElement('div');
        const divtitle = document.createElement('div');
        divtitle.className = 'day-title-div'
        if (today.daysweek === day.daysweek) {
            divday.id = 'today';
        }
        const day_week = document.createElement('h3');
        day_week.innerHTML = days[day.daysweek];
        const day_date = document.createElement('h3');
        if (day.day < 10) {
            day_date.innerHTML += '0';
        }
        day_date.innerHTML += day.day;
        divtitle.appendChild(day_week)
        divtitle.appendChild(day_date)
        divday.appendChild(divtitle)
        titleday.appendChild(divday);
    })

    document.getElementById('bar').appendChild(titleday)
    get_event_day(week[0]);

    document.getElementById('time-now').style.pointerEvents = 'none';
}


document.getElementById('context-menu-add').addEventListener('click', async () => {
    const result = await window.window_.addevent(slot_clicked);
    if (result.ok) {
        location.reload()
    }
})

document.getElementById('context-menu-modify').addEventListener('click', async () => {
    const result = await window.window_.modifyevent(event_clicked);
    if (result.ok) {
        location.reload();
    }
})

document.getElementById('context-menu-delete').addEventListener('click', async () => {
    const result = await window.api.deleteevent(event_clicked);
    if (result.ok) {
        location.reload();
    }
})

function timetravel_update(value) {
    time_travel += value;
    window.api.putincache('tools/calendar/time-travel', time_travel);
    location.reload();
}

document.getElementById('go-past').addEventListener('click', () => {
    timetravel_update(-7);
})

document.getElementById('go-futur').addEventListener('click', () => {
    timetravel_update(7);
})

document.getElementById('select-week-input').addEventListener('change', (value) => {
    const date_week = value.target.value.split('-W');
    timetravel_update(7 * (parseInt(date_week[1]) - parseInt(week_number)))
})

function getDateFromWeek(year, week, weekday = 1) {
    const simple = new Date(year, 0, 1 + (week - 1) * 7);
    const dayOfWeek = simple.getDay(); // 0 (dim) à 6 (sam)

    const ISOweekStart = simple;
    if (dayOfWeek <= 4) {
        ISOweekStart.setDate(simple.getDate() - dayOfWeek + weekday);
    } else {
        ISOweekStart.setDate(simple.getDate() + 7 - dayOfWeek + weekday);
    }

    return ISOweekStart;
}

const menu = document.getElementById('context-menu');
document.addEventListener('click', () => {
    menu.style.display = 'none';
})
document.getElementById('grid').addEventListener('scroll', () => {
    menu.style.display = 'none'
})

function get_divslot(hour, dayweek, demi) {
    return document.getElementsByClassName('day')[dayweek].childNodes[0];
}

function hexToRgb(hex) {
    if (!hex) {
        return '0, 0, 0'
    }
    hex = hex.replace(/^#/, '');

    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `${r}, ${g}, ${b}`;
}

function render_event(slot) {
    if (typeof slot === 'string') {
        slot = JSON.parse(slot).data;
    }
    const event_div = document.createElement('div');
    event_div.style.zIndex = 10;
    const color = hexToRgb(slot.color);
    event_div.style.backgroundColor = `rgba(${color} ,0.4)`;
    event_div.style.borderLeft = `7px solid rgb(${color})`
    event_div.style.width = `${slot.widthRatio * 100}%`;
    event_div.style.left = `${(slot.offset / slot.totalColumns) * 100}%`;
    event_div.style.top = `${((slot.startDate.getHours() + (slot.startDate.getMinutes() / 60)) * 100)}px`

    const duration = parseFloat(((slot.endDate - slot.startDate) / (1000 * 60 * 60)).toFixed(2));

    //const start__ = parseFloat(start.getHours() + start_)
    event_div.style.height = parseInt((duration * 100)) + 'px';


    //event_div.style.transform = `translateY(${(100 * start__) + (2 * start.getHours()) - (duration_befor * 100 + duration_befor * 2)}px) translateX(${(t) * 100}%)`
    event_div.style.boxSizing = 'border-box'

    const name = document.createElement('h4');
    name.innerHTML = slot.name
    name.className = 'event-name'

    const location = document.createElement('p');
    location.innerHTML = slot.location;
    location.className = 'event-location'

    const organizer = document.createElement('p');
    if (slot.organizer) {
        if(get_name_by_uid(slot.organizer)) {
            organizer.innerHTML = get_name_by_uid(slot.organizer).name;
            organizer.className = 'event-organizer'
        }
    }
    const description = document.createElement('p');
    description.innerHTML = slot.description;
    description.className = 'event-description'

    event_div.appendChild(name)
    event_div.appendChild(description)
    event_div.appendChild(location)
    event_div.appendChild(organizer)

    event_div.className = 'event';

    event_div.addEventListener('contextmenu', (e) => {
        e.stopPropagation()
        e.preventDefault();
        menu.style.top = `${e.pageY}px`;
        menu.style.left = `${e.pageX}px`;
        menu.style.display = 'block';
        document.getElementById('context-menu-add').style.display = 'none';
        document.getElementById('context-menu-modify').style.display = 'block';
        const { startDate, endDate, ...event } = slot;
        event_clicked = event.uid;
    })

    const div = get_divslot(slot.startDate.getHours(), getDayOfWeek(slot.startDate.getDay()) - 1, 0)
    div.appendChild(event_div);
}
