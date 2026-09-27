import Avatar from "@mui/material/Avatar";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const colorFor = (name: string) => {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return `hsl(${Math.abs(hash) % 360} 55% 45%)`;
};

export function NameAvatar({
  name,
  size = 40,
}: {
  name: string;
  size?: number;
}) {
  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        bgcolor: colorFor(name),
      }}
    >
      {initials(name)}
    </Avatar>
  );
}
