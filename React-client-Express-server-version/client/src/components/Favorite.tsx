import "../styles/Favorite.css";

export interface Favorite {
    id: number;
    zip: string;
    location: string;
}

interface FavoriteProps {
    favorites: Favorite[];
    selectedFavorite: string;
    isAddDisabled: boolean;
    isDeleteDisabled: boolean;
    onAddFavorite: () => void;
    onDeleteFavorite: (zip: string) => void;
    onSelectFavorite: (zip: string) => void;
}

export function FavoriteComponent({ favorites, selectedFavorite, isAddDisabled, isDeleteDisabled, onAddFavorite, onDeleteFavorite, onSelectFavorite }: FavoriteProps) {    
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const zip = event.target.value;
        onSelectFavorite(zip);
    };

    return (
        <>
            <div className="favorite-container">
                <button className="add-favorite-btn" onClick={onAddFavorite} disabled={isAddDisabled}>Add to Favorites</button>
                <div className="favorite-title">Go to favorite: </div>
                <select className="favorite-select" value={selectedFavorite} onChange={handleSelectChange}>
                    <option value=""></option>
                    {favorites.map((favorite, index) => (
                        <option key={index} value={favorite.zip}>
                            {favorite.location} ({favorite.zip})
                        </option>
                    ))}
                </select>
                <button className="delete-favorite-btn" onClick={() => onDeleteFavorite(selectedFavorite)} disabled={isDeleteDisabled}>Delete Favorite</button>
            </div>
        </>
    );
}