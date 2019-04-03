import { Observable } from "rxjs";
import { share } from "rxjs/operators";
import { Readable } from "stream";

export default function fromReadableStream<T = any>(
  stream: Readable,
  finishEventName = "end",
  dataEventName = "data"
) {
  stream.pause();

  return new Observable<T>(observer => {
    function dataHandler(data: T) {
      observer.next(data);
    }

    function errorHandler(err: Error) {
      observer.error(err);
    }

    function endHandler() {
      observer.complete();
    }

    stream.addListener(dataEventName, dataHandler);
    stream.addListener("error", errorHandler);
    stream.addListener(finishEventName, endHandler);

    stream.resume();

    return () => {
      stream.removeListener(dataEventName, dataHandler);
      stream.removeListener("error", errorHandler);
      stream.removeListener(finishEventName, endHandler);
    };
  }).pipe(share());
}
