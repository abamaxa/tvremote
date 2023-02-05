export interface Player {

  playVideo: (video: string) => void;
  executeCommand: (command: string) => void;

  fetchCollection: () => Promise<Response>;
}

export class VideoPlayer implements Player {

  readonly currentCollection: string;
  readonly host: string;

  constructor(currentCollection: string, host: string) {
    this.currentCollection = currentCollection;
    this.host = host;
  }

  playVideo = (video: string) => {
    const params = {
      method: 'POST',
      body: JSON.stringify({collection: this.currentCollection, video: video}),
      headers: {
        'Content-Type': 'application/json'
      }
    }

    fetch(this.makeUrl('play'), params)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
      })
      .catch((err) => {
        console.log(err)
        alert(err);
      })
  }

  executeCommand = (command: string) => {
    const params = {
      method: 'POST',
      body: JSON.stringify({command: command}),
      headers: {
        'Content-Type': 'application/json'
      }
    }

    fetch(this.makeUrl('remote'), params)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
      })
      .catch((err) => {
        console.log(err)
        alert(err);
      })
  }

  fetchCollection = (): Promise<Response> => {
    const url = this.currentCollection ? this.makeUrl('videos/' + this.currentCollection) : this.makeUrl("collections")
    return fetch(url);
  }

  makeUrl = (resource: string): string => {
    return `${this.host}${resource}`;
  }
}