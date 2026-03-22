# SheetAPI

**Turn any Google Sheet into a REST API instantly. No backend required.**

## Quick Start

1. Open Google Spreadsheet
2. Extensions > Apps Script → paste all `src/` files
3. Deploy as Web App (Execute as: Me, Access: Anyone anonymous)
4. SheetAPI > Open Settings → copy API key

## Endpoints

| Method | Action | Description |
|--------|--------|-------------|
| GET | `?action=read&sheet=NAME` | Get all rows |
| GET | `?action=read&sheet=NAME&col=val` | Filter rows |
| GET | `?action=read&sheet=NAME&limit=10&offset=0` | Paginate |
| POST | `?action=create&sheet=NAME` | Add row (Pro) |
| POST | `?action=update&sheet=NAME&row=2` | Update row (Pro) |
| POST | `?action=delete&sheet=NAME&row=2` | Delete row (Pro) |
| GET | `?action=docs` | Auto API docs |

## Response

```json
{"ok": true, "data": [{"_row": 2, "Name": "A"}], "total": 1}
```

## Plans

| Feature | Free | Pro |
|---------|------|-----|
| Daily requests | 100 | 10,000 |
| Read (GET) | Yes | Yes |
| Write (POST) | No | Yes |

## License

MIT
