export type Track = {
  id: string,
  names: {
    en_gb: string;
    [key: string]: string;
  };
  icon: string,
  coords: {
    X: number;
    Y: number;
  };
};

export type TrackMap = {
  [id: string]: Track;
};