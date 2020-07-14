// The sculpture interface
export interface SculptureInterface{
    name:string,
    color:string,
    soundSpec: {
        vox:number[],
        param: ToGranulatorParam[]
    }
    coords: Coord[],
    description: string
}
// the granulator parameters (in Sculpture)
export interface ToGranulatorParam{
    gain: number;
    time: number;
    timeRND: number;
    dencity: number;
    window: "blackman"|"triangular"|"hanning";
}
// Coordinate % Tracking Interfaces 
//
export interface Coord{
    lat:number,
    lon:number  
}
//
export interface CoordHead{
    lat:number; 
    lon:number; 
    head:number;
}
//
export interface DistBear{
    distance: number;
    bearing: number;
}