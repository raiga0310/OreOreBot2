import type { MemeTemplate } from '../../model/meme-template.js';

const template = (inject: string) =>
  `――今、逃げたね。\n逃げたでしょ。\n${inject}から悪くないって、正当化した。\n\n自分がいい子だって言い訳が見つかってよかったね。\nどんな気分？\n\n……手遅れなのは頭（おつむ）からなのかな。\n\nだって、\nいつまでもそのまんまだよ。\n今だって、ずーっとそう。\n\n――ほんとあなたって、自分さえ良ければ良いんだね。`;

export const nigetane: MemeTemplate<never, never> = {
  commandNames: ['nigetane'],
  description: '… 〜から悪くないって、… (from Arcaea "Final Verdict")',
  flagsKeys: [],
  optionsKeys: [],
  errorMessage: '……手遅れなのは頭（おつむ）からなのかな。',
  generate: ({ body }) => template(body)
};
