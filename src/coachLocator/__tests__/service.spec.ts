import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { load } from "../service";

describe("coach lookup service", () => {

  beforeAll(() => {
    window.fetch = vi.fn().mockImplementation(window.fetch)
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls fumbbl api", () => {

    load("name");

    expect(window.fetch).toBeCalledWith("https://fumbbl.com/api/match/list/name")
  });
});