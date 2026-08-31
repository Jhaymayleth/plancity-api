import { useEffect, useState } from "react";

import { EventCard } from "../components/EventCard/EventCard";
import { favoriteService } from "../services/favoriteService";
import type { Event } from "../types/event";

export function FavoritesPage() {
  const [favorites, setFavorites] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await favoriteService.getAll();

        setFavorites(data);
      } catch {
        setError("No se pudieron cargar tus favoritos.");
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const handleFavoriteChange = (eventId: string, isFavorite: boolean) => {
    if (!isFavorite) {
      setFavorites((currentFavorites) =>
        currentFavorites.filter((event) => event.id !== eventId),
      );
    }
  };

  if (loading) {
    return (
      <main>
        <h1>Mis favoritos</h1>
        <p>Cargando favoritos...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>Mis favoritos</h1>
        <p role="alert">{error}</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Mis favoritos</h1>

      {favorites.length === 0 ? (
        <p>No tienes eventos favoritos.</p>
      ) : (
        <section>
          {favorites.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isFavorite
              onFavoriteChange={(isFavorite) =>
                handleFavoriteChange(event.id, isFavorite)
              }
            />
          ))}
        </section>
      )}
    </main>
  );
}