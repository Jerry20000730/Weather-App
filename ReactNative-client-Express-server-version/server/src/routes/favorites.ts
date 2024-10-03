import { Router, Request, Response } from 'express';

const router = Router();

var favorites: favorite[] = [];

var gid = 0;

class favorite {
    private id: number;
    private zip: string;
    private city: string;
    private state: string;

    public constructor(id: number, zip: string, city: string, state: string) {
        this.id = id;
        this.zip = zip;
        this.city = city;
        this.state = state;
    }

    public getId(): number {
        return this.id;
    }

    public getZip(): string {
        return this.zip;
    }

    public getCity(): string {
        return this.city;
    }

    public getState() : string {
        return this.state;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public setZip(zip: string): void {
        this.zip = zip;
    }

    public setCity(city : string): void {
        this.city = city
    }

    public setState(state: string): void {
        this.state = state;
    }
}

router.get('/favorites', (req: Request, rsp: Response) => { 
    rsp.json(favorites);
});

router.post('/favorites', (req: Request, rsp: Response) => { 
    const { zip, city, state } = req.body;
    if (zip && city && state) {
        const isDuplicate = favorites.some(favorite => favorite.getZip() === zip);
        if (!isDuplicate) {
            const newFavorite = new favorite(gid, zip, city, state);
            gid++;
            favorites.push(newFavorite);
            rsp.status(200).json({ message: 'Favorite added successfully.' });
        } else {
            rsp.status(400).json({ error: { message: 'Duplicate favorite item.' } });
        }
    } else {
        rsp.status(400).json({ error: { message: 'Invalid favorite item.' } });

    }
});

router.delete('/favorites/:id', (req: Request, rsp: Response) => { 
    const { id } = req.params;
    if (parseInt(id) >= 0 && parseInt(id) < gid) {
        favorites = favorites.filter(item => item.getId() !== parseInt(id));
        rsp.status(200).json({ message: 'Favorite deleted successfully.' });
    } else {
        rsp.status(400).json({ error: { message: 'Duplicate favorite id.' } });

    }
});

export default router;