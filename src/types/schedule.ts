import { EventInput } from '@fullcalendar/core/index.js'

export interface ScheduleEvent extends EventInput {
    /**
     * Start date of the event in milliseconds since epoch.
     */
    start: Extract<EventInput['start'], number>
    /**
     * End date of the event in milliseconds since epoch.
     */
    end: Extract<EventInput['end'], number>
    id: Extract<EventInput['id'], string>
    /**
     * The id of the user who created the event
     */
    owner: string
}
