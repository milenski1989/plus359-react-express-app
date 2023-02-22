import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Artworks extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    artist: string;

    @Column()
    technique: string;

    @Column()
    dimensions: string;

    @Column()
    price: number;

    @Column()
    notes: string;

    @Column()
    onWall: number;

    @Column()
    inExhibition: number;

    @Column()
    storageLocation: string;

    @Column()
    cell: string;

    @Column()
    position: number;

    @Column()
    image_url: string;

    @Column()
    image_key: string;

    @Column()
    download_url: string;

    @Column()
    download_key: string;

    @Column()
    by_user: string;
}

