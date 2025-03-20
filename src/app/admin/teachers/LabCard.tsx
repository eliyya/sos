import { minutesToHHMM } from '@/lib/utils'
import Link from 'next/link'

export interface LabCardProps {
    name: string
    open_hour_in_minutes: number
    close_hour_in_minutes: number
    id: string
}
export function LabCard(props: LabCardProps) {
    return (
        <div
            className={`
                flex justify-between items-center align-middle gap-4 
                bg-white shadow-md p-4 rounded-lg transition-all
                hover:-translate-y-0.5 hover:shadow-lg
            `}
        >
            <div className="flex gap-2 items-baseline text-black">
                <h2 className="text-lg">{props.name}</h2>
                <span className="text-xs">
                    Horario: {minutesToHHMM(props.open_hour_in_minutes)} -
                    {minutesToHHMM(props.close_hour_in_minutes)}
                </span>
            </div>
            <div className="flex gap-4 items-center">
                <Link
                    className="h-5 aspect-square hover:bg-gray-200 rounded-xs"
                    href={`/admin/labs/${props.id}/tools`}
                >
                    <svg viewBox="0 -0.5 21 21">
                        <g
                            transform="translate(-339.000000, -560.000000)"
                            fill="#000000"
                        >
                            <g transform="translate(56.000000, 160.000000)">
                                <polygon points="304 417.175248 301.033418 420 292.131575 411.524747 289.164993 414.350497 283 408.480248 285.966582 405.654497 289.164993 408.699995 292.131575 405.874245 288.928967 402.824752 291.895549 400 298.065788 405.874245 295.099206 408.699995" />
                            </g>
                        </g>
                    </svg>
                </Link>
                <Link
                    className="h-5 aspect-square hover:bg-gray-200 rounded-xs"
                    href={'/admin/labs/edit/' + props.id}
                >
                    <svg viewBox="0 0 24 24">
                        <path d="M 18 2 L 15.585938 4.4140625 L 19.585938 8.4140625 L 22 6 L 18 2 z M 14.076172 5.9238281 L 3 17 L 3 21 L 7 21 L 18.076172 9.9238281 L 14.076172 5.9238281 z" />
                    </svg>
                </Link>
                <Link
                    className="h-5 aspect-square hover:bg-gray-200 rounded-xs"
                    href={'/admin/labs/delete/' + props.id}
                >
                    <svg viewBox="0 0 26 26">
                        <path d="M 21.734375 19.640625 L 19.636719 21.734375 C 19.253906 22.121094 18.628906 22.121094 18.242188 21.734375 L 13 16.496094 L 7.761719 21.734375 C 7.375 22.121094 6.746094 22.121094 6.363281 21.734375 L 4.265625 19.640625 C 3.878906 19.253906 3.878906 18.628906 4.265625 18.242188 L 9.503906 13 L 4.265625 7.761719 C 3.882813 7.371094 3.882813 6.742188 4.265625 6.363281 L 6.363281 4.265625 C 6.746094 3.878906 7.375 3.878906 7.761719 4.265625 L 13 9.507813 L 18.242188 4.265625 C 18.628906 3.878906 19.257813 3.878906 19.636719 4.265625 L 21.734375 6.359375 C 22.121094 6.746094 22.121094 7.375 21.738281 7.761719 L 16.496094 13 L 21.734375 18.242188 C 22.121094 18.628906 22.121094 19.253906 21.734375 19.640625 Z" />
                    </svg>
                </Link>
            </div>
        </div>
    )
}
