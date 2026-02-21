export default function AvailabilityBadge({ status }: { status: string }) {
    const styles = {
        available: 'bg-green-100 text-green-800 ring-green-600/20',
        unavailable: 'bg-red-100 text-red-800 ring-red-600/20',
        booking_only: 'bg-orange-100 text-orange-800 ring-orange-600/20',
    }

    const labels = {
        available: 'Available',
        unavailable: 'Unavailable',
        booking_only: 'Booking Only',
    }

    const statusKey = status as keyof typeof styles

    if (!styles[statusKey]) return null

    return (
        <span
            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${styles[statusKey]}`}
        >
            {labels[statusKey]}
        </span>
    )
}
