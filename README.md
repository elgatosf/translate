<div align="center">

# @elgato/translate

Command-line tool for translating resource files with [DeepL](https://www.deepl.com/)

[![@elgato/translate npm package](https://img.shields.io/npm/v/%40elgato/translate?logo=npm&logoColor=white)](https://www.npmjs.com/package/@elgato/translate)
[![Elgato homepage](https://img.shields.io/badge/Elgato-3431cf?labelColor=grey&logo=elgato)](https://elgato.com)

</div>

## Pre-requisites

- DeepL auth key
- English text in JSON or RESW format

## Usage

1. Install `@elgato/translate`

```
npm install @elgato/translate
```

2. Create a `translations.config.json` file ([learn more](#configuration))

```json
{
    "source": "locales/en.json",
    "targets": [
        {
            "code": "de"
        },
        {
            "code": "fr"
        }
    ]
}
```

3. Translate your English text.

```
translate -k <DEEPL_AUTH_KEY>
```

## Configuration

Main configuration that defines the source texts, and target languages.

| Name        | Type                                                              | Description                    | Required |
| ----------- | ----------------------------------------------------------------- | ------------------------------ | -------- |
| `source`    | `string`                                                          | Path to the English text.      | ✅       |
| `targets`   | `TargetLanguage[]`                                                | Languages to translate to.     | ✅       |
| `formality` | `"less"`, `"prefer_less"`, `"default"`, `"prefer_more"`, `"more"` | Formality of the translations. |          |

### TargetLanguage

Target languages the source texts will be translated to.

| Name        | Type                                                              | Description                                                                                                                      | Required |
| ----------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `code`      | `string`                                                          | Language code, [learn more](https://developers.deepl.com/docs/getting-started/supported-languages#translation-target-languages). | ✅       |
| `formality` | `"less"`, `"prefer_less"`, `"default"`, `"prefer_more"`, `"more"` | Formality of the translations.                                                                                                   |          |
| `file`      | `string`                                                          | Output file.                                                                                                                     |          |
| `glossary`  | `string`                                                          | DeepL glossary identifier.                                                                                                       |          |
| `overrides` | `Override[]`                                                      | Manual overrides.                                                                                                                |          |

### Override

Allows for manual translations.

| Name   | Type     | Description                                                 | Required |
| ------ | -------- | ----------------------------------------------------------- | -------- |
| `text` | `string` | Text that should not be translated with the remote service. | ✅       |
| `out`  | `string` | Output text; when unspecified, the original text is output. |          |

## CLI Options

`-k, --auth-key <auth_key>`

- Default: `undefined` (required)
- Type: String

The DeepL authentication key used to translate text with DeepL

`-c, --config <path>`

- Default: `translations.config.json`
- Type: String

Path to the configuration file.
