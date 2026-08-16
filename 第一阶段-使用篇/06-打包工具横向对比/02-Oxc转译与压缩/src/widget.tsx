// 一段「TS + JSX」混合源码：有类型注解、interface、enum，还有 JSX。
// 浏览器无法直接运行它，必须先「转译」成普通 JS——这一步在 Vite 8 里就交给 Oxc。

interface Props {
  title: string;
  count: number;
}

enum Theme {
  Light = 'light',
  Dark = 'dark',
}

const theme: Theme = Theme.Dark;

export function Widget({ title, count }: Props) {
  const label: string = `${title} x ${count}`;
  return <div className={theme}>{label}</div>;
}
