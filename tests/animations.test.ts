import assert from "node:assert/strict";
import { test } from "node:test";
import { counterValueAt, formatCounter, staggerDelay } from "../src/lib/animations.ts";

test("counter formatting preserves verified values and Indonesian decimals", () => {
  assert.equal(formatCounter(1), "1");
  assert.equal(formatCounter(2000), "2.000");
  assert.equal(formatCounter(98.5, 1), "98,5");
  assert.equal(formatCounter(0, 2), "0,00");
  assert.throws(() => formatCounter(Infinity), RangeError);
  assert.throws(() => formatCounter(1, -1), RangeError);
});

test("count-up starts at zero, eases out, and finishes at the exact value", () => {
  assert.equal(counterValueAt(2000, 0, 2000), 0);
  assert.equal(counterValueAt(2000, 1000, 2000), 1750);
  assert.equal(counterValueAt(2000, 2000, 2000), 2000);
  assert.equal(counterValueAt(98.5, 5000, 2000), 98.5);
  assert.equal(counterValueAt(2000, -100, 2000), 0);
  assert.equal(counterValueAt(2000, 0, 0), 2000);
});

test("viewport-batch staggering never accumulates catalog-length delays", () => {
  assert.deepEqual([0, 1, 2, 3, 67].map(staggerDelay), [0, 90, 180, 270, 270]);
});
