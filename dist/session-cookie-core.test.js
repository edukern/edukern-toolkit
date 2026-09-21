import { test } from "node:test";
import assert from "node:assert/strict";
import { setSignedCookieIn, clearSignedCookieIn, readSignedCookieIn, } from "./session-cookie-core.js";
function fakeStore() {
    const values = new Map();
    let lastOptions;
    const store = {
        set(name, value, options) {
            values.set(name, value);
            lastOptions = options;
        },
        delete(name) {
            values.delete(name);
        },
        get(name) {
            return values.get(name);
        },
    };
    return { store, getLastOptions: () => lastOptions };
}
test("grava e lê um cookie de sessão", async () => {
    const { store } = fakeStore();
    await setSignedCookieIn(store, "session", "token-abc", 60_000);
    assert.equal(await readSignedCookieIn(store, "session"), "token-abc");
});
test("limpa o cookie", async () => {
    const { store } = fakeStore();
    await setSignedCookieIn(store, "session", "token-abc", 60_000);
    await clearSignedCookieIn(store, "session");
    assert.equal(await readSignedCookieIn(store, "session"), undefined);
});
test("converte maxAgeMs pra segundos, arredondado pra baixo", async () => {
    const { store, getLastOptions } = fakeStore();
    await setSignedCookieIn(store, "session", "token-abc", 1500);
    assert.equal(getLastOptions()?.maxAge, 1);
});
test("cookie inexistente lê undefined", async () => {
    const { store } = fakeStore();
    assert.equal(await readSignedCookieIn(store, "session"), undefined);
});
