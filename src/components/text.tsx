export function BidiText({ text }: { text: string }) {
  return text
    .split(/(ASP\.NET Core|\.NET|C#|OAuth 2\.0|OpenID Connect|SQL Server)/g)
    .map((part, index) =>
      /^(ASP\.NET Core|\.NET|C#|OAuth 2\.0|OpenID Connect|SQL Server)$/.test(
        part,
      ) ? (
        <bdi dir="ltr" key={index}>
          {part}
        </bdi>
      ) : (
        part
      ),
    );
}
