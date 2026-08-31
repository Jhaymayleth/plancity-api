import { Link } from "react-router-dom";

import type { Event } from "../../types/event";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const image = event.images[0]?.url;

  return (
    <article>
      {image && (
        <img
          src={image}
          alt={event.name}
          width="300"
        />
      )}

      <div>
        <p>{event.category.name}</p>

        <h2>{event.name}</h2>

        <p>{event.description}</p>

        <p>{event.location}</p>

        <p>${event.price}</p>

        <Link to={`/events/${event.id}`}>
          Ver detalles
        </Link>
      </div>
    </article>
  );
}