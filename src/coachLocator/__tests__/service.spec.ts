import type { Mock } from "vitest";

import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { load } from "../service";

describe("coach lookup service", () => {

  let mock: Mock<any, any>;

  beforeAll(() => {
    mock = vi.fn().mockImplementation(window.fetch);
    window.fetch = mock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls fumbbl api", async () => {

    mock.mockImplementationOnce((url: string) => {
      let response: { id: number }[] = [];
      if (url.endsWith("/name")) {
        response = initialResponse;
      } else if (url.endsWith("/name/2")) {
        response = intermediateResponse;
      } else if (url.endsWith("/name/0")) {
        response = finalResponse;
      }

      return new Response(JSON.stringify(response));
    });

    const response: { id: number }[] = await load("name");

    expect(window.fetch).toBeCalledTimes(3);

    expect(window.fetch).toBeCalledWith("https://fumbbl.com/api/match/list/name");
    expect(window.fetch).toBeCalledWith("https://fumbbl.com/api/match/list/name/2");
    expect(window.fetch).toBeCalledWith("https://fumbbl.com/api/match/list/name/0");

    const expected: { id: number }[] = [ {id: 3 }, { id: 2 }, { id: 1 }, { id: 0 }];

    expect(response).toEqual(expected);
  });
});

const initialResponse = [{ id: 3 }, { id: 2 }];
const intermediateResponse = [{ id: 2 }, { id: 1 }, { id: 0 }];
const finalResponse = [{ id: 0 }];