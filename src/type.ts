export type IsRunningProps = {
    isRunning: boolean
    timer: number
    setTimer: React.Dispatch<React.SetStateAction<number>>;
}
export type SetIsRunningProps = {
    setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
    timer: number
}

export type scoreType = {
    id: number;
    name: string;
    score: number;
};
