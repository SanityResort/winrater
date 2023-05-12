import type {Mock} from 'vitest'

import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { load } from "../service";

describe("coach lookup service", () => {

  let mock: Mock<any, any>

  beforeAll(() => {
    mock = vi.fn().mockImplementation(window.fetch);
    window.fetch = mock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls fumbbl api", async () => {

    mock.mockImplementationOnce((url: string) => {
      return new Response(JSON.stringify(initialResponse));
    })

    const response: [] = await load("name");

    expect(window.fetch).toBeCalledWith("https://fumbbl.com/api/match/list/name")

    expect(response).toMatchObject(initialResponse)
  });
});

const initialResponse = [{ id: 3 }, {id: 2}]
const intermediateResponse = [{ id: 2 }, {id: 1}, {id: 0}]
const finalResponse = [{ id: 0 }]