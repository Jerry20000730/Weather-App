import { Router, Request, Response } from 'express';

const router = Router();

var favorites: favorite[] = [];

var gid = 0;

class favorite {
    private id: number;
    private zip: string;
    private location: string;

    public constructor(id: number, zip: string, location: string) {
        this.id = id;
        this.zip = zip;
        this.location = location
    }

    public getId(): number {
        return this.id;
    }

    public getZip(): string {
        return this.zip;
    }

    public getLocation(): string {
        return this.location;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public setZip(zip: string): void {
        this.zip = zip;
    }

    public setLocation(location: string): void {
        this.location = location
    }
}

router.get('/favorites', (req: Request, rsp: Response) => { 
    rsp.json(favorites);
});

router.post('/favorites', (req: Request, rsp: Response) => { 
    const { zip, location } = req.body;
    // 校验输入
    if (zip && location) {
        const isDuplicate = favorites.some(favorite => favorite.getZip() === zip);
        if (!isDuplicate) {
            const newFavorite = new favorite(gid, zip, location);
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