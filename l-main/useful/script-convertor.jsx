import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

const scriptMap = {
  a: "あ", b: "ひ", c: "し", d: "だ", e: "え",
  f: "か", g: "き", h: "く", i: "け", j: "こ",
  k: "さ", l: "し", m: "す", n: "せ", o: "そ",
  p: "た", q: "ち", r: "つ", s: "て", t: "と",
  u: "な", v: "に", w: "ぬ", x: "ね", y: "の", z: "る"
};

const reverseMap = Object.fromEntries(
  Object.entries(scriptMap).map(([key, value]) => [value, key])
);

export default function SecretScriptConverter() {
  const [input, setInput] = useState("");
  const [isToScript, setIsToScript] = useState(true);

  const convert = (text) => {
    return text.split("").map((char) => {
      if (isToScript) {
        return scriptMap[char.toLowerCase()] || char;
      } else {
        return reverseMap[char] || char;
      }
    }).join("");
  };

  return (
    <div className="p-6 max-w-xl mx-auto grid gap-4">
      <h1 className="text-3xl font-bold text-center">Secret Script Converter 🕵️‍♂️</h1>

      <div className="flex items-center justify-center gap-2">
        <span className="text-sm">English → Secret</span>
        <Switch checked={isToScript} onCheckedChange={() => setIsToScript(!isToScript)} />
        <span className="text-sm">Secret → English</span>
      </div>

      <Input
        placeholder="Type here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <Card>
        <CardContent className="p-4 text-lg whitespace-pre-wrap">
          {convert(input)}
        </CardContent>
      </Card>
    </div>
  );
}
