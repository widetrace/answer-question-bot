export interface author {
  id: number,
  name: {
    first: string,
    second: string,
  },
  country: number
}

export interface book {
  id: number,
  name: string,
  short: string,
  author: number,
  tag: number | Array<number>
}

export interface country {
  id: number,
  name: string,
  region: string | null
}

export interface tag {
  id: number,
  name: string
}
