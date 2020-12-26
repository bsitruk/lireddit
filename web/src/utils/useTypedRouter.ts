import { NextRouter, useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

type TypedRouter<T> = NextRouter & {
  query: ParsedUrlQuery & T;
};

export function useTypedRouter<T>(): TypedRouter<T> {
  const router = useRouter();
  return router as TypedRouter<T>;
}
