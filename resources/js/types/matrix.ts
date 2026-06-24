// resources/js/types/matrix.ts

export interface Iea {
    id: number;
    kode: string;     // contoh: IEA-1
    deskripsi: string;
}

export interface Ppm {
    id: number;
    kode: string;     // contoh: PPM-1
    deskripsi: string;
    ieas?: Iea[];     // Relasi bawaan backend
}

export interface Cpl {
    id: number;
    kode: string;     // contoh: CPL-1
    deskripsi: string;
    ieas?: Iea[];     // Relasi pivot bawaan backend
}

export interface MatrixProps {
    cpls: Cpl[];
    ieas: Iea[];
    ppms: Ppm[];
    cplToPpmMatrix: Record<number, Record<number, boolean>>; 
}