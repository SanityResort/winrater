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

    mock.mockImplementation((url: string) => {
      let response: { id: number }[] = [];
      if (url.endsWith("/name")) {
        response = [{ id: 3 }, { id: 2 }];
      } else if (url.endsWith("/name/2")) {
        response = [{ id: 2 }, { id: 1 }, { id: 0 }];
      } else if (url.endsWith("/name/0")) {
        response = [{ id: 0 }];
      }

      return new Response(JSON.stringify(response));
    });

    const emitMock = vi.fn((_: number) => {})

    const response: { id: number }[] = await load("name", emitMock);

    expect(window.fetch).toHaveBeenCalledTimes(3);

    expect(window.fetch).toHaveBeenCalledWith("https://fumbbl.com/api/match/list/name");
    expect(window.fetch).toHaveBeenCalledWith("https://fumbbl.com/api/match/list/name/2");
    expect(window.fetch).toHaveBeenCalledWith("https://fumbbl.com/api/match/list/name/0");

    expect(emitMock).toHaveBeenCalledTimes(2)
    expect(emitMock).toHaveBeenCalledWith(3)
    expect(emitMock).toHaveBeenCalledWith(4)

    const expected: { id: number }[] = [ {id: 3 }, { id: 2 }, { id: 1 }, { id: 0 }];

    expect(response).toEqual(expected);
  });
});