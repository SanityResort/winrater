import type { Mock } from "vitest";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { load } from "../service";

describe("coach lookup service", () => {

  let fetchMock: Mock;
  let countCallback: Mock;
  let matchesCallback: Mock;
  let errorCallback: Mock;

  const existingCoach = "name";

  beforeAll(() => {
    fetchMock = vi.fn().mockImplementation(window.fetch);
    window.fetch = fetchMock;

    countCallback = vi.fn();
    matchesCallback = vi.fn();
    errorCallback = vi.fn();
  });

  beforeEach(() => {

    fetchMock.mockImplementation((url: string) => {
      let response: { id: number, name?: string }[] = [];
      if (url.indexOf("search") > -1) {
        response = [{ id: 1, name: existingCoach }];
      } else if (url.endsWith("/" + existingCoach)) {
        response = [{ id: 3 }, { id: 2 }];
      } else if (url.endsWith("/" + existingCoach + "/2")) {
        response = [{ id: 2 }, { id: 1 }, { id: 0 }];
      } else if (url.endsWith("/" + existingCoach + "/0")) {
        response = [{ id: 0 }];
      }

      return new Response(JSON.stringify(response));
    });

  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls fumbbl api", async () => {

    await load(existingCoach, countCallback, matchesCallback, errorCallback);

    const expected: { id: number }[] = [{ id: 3 }, { id: 2 }, { id: 1 }, { id: 0 }];

    expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(fetchMock).toHaveBeenCalledWith("https://fumbbl.com/api/coach/search/name");
    expect(fetchMock).toHaveBeenCalledWith("https://fumbbl.com/api/match/list/name");
    expect(fetchMock).toHaveBeenCalledWith("https://fumbbl.com/api/match/list/name/2");
    expect(fetchMock).toHaveBeenCalledWith("https://fumbbl.com/api/match/list/name/0");

    expect(countCallback).toHaveBeenCalledTimes(3);
    expect(countCallback).toHaveBeenCalledWith(0);
    expect(countCallback).toHaveBeenCalledWith(3);
    expect(countCallback).toHaveBeenCalledWith(4);

    expect(matchesCallback).toHaveBeenCalledTimes(2);
    expect(matchesCallback).toHaveBeenCalledWith([]);
    expect(matchesCallback).toHaveBeenCalledWith(expected);

    expect(errorCallback).toHaveBeenCalledTimes(1);
    expect(errorCallback).toHaveBeenCalledWith("");
  });

  it("aborts for unknown coach", async () => {

    await load("foo", countCallback, matchesCallback, errorCallback);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith("https://fumbbl.com/api/coach/search/foo");

    expect(countCallback).toHaveBeenCalledTimes(1);
    expect(countCallback).toHaveBeenCalledWith(0);

    expect(matchesCallback).toHaveBeenCalledTimes(1);
    expect(matchesCallback).toHaveBeenCalledWith([]);

    expect(errorCallback).toHaveBeenCalledTimes(2);
    expect(errorCallback).toHaveBeenCalledWith("");
    expect(errorCallback).toHaveBeenCalledWith("Unknown coach 'foo'");
  });

  it.each([{ input: null as unknown as string, name: "null" }, { input: " ", name: "empty" }])
  ("aborts for $name coach", async (param) => {

    await load(param.input, countCallback, matchesCallback, errorCallback);

    expect(fetchMock).toHaveBeenCalledTimes(0);

    expect(countCallback).toHaveBeenCalledTimes(1);
    expect(countCallback).toHaveBeenCalledWith(0);

    expect(matchesCallback).toHaveBeenCalledTimes(1);
    expect(matchesCallback).toHaveBeenCalledWith([]);

    expect(errorCallback).toHaveBeenCalledTimes(2);
    expect(errorCallback).toHaveBeenCalledWith("");
    expect(errorCallback).toHaveBeenCalledWith("No coach name given");
  });

});
