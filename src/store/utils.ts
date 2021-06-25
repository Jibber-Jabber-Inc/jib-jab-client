import create from "zustand";
import { pipe } from "ramda";
import { devtools } from "zustand/middleware";

export const createStore = pipe(devtools, create);
