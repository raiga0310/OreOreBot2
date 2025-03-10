# Security Policy

ここでは OreOreBot2 のセキュリティポリシーについて説明します。

## Supported Versions

以下のテーブルは、OreOreBot2 のサポートバージョンを示しています。

| Version  | Supported | Support Start Date                                                        | Support End Date |
| -------- | --------- | ------------------------------------------------------------------------- | ---------------- |
| `v1.x.y` | ✅        | [2022/02/27](https://github.com/approvers/OreOreBot2/releases/tag/v1.0.0) | 未定             |

## Reporting a Vulnerability

OreOreBot2 自身の脆弱性を発見した際は **[me@m2en.dev](mailto:me@m2en.dev) 宛に下記 PGP 鍵で暗号化を施して** ご連絡ください。
当リポジトリの Issue や、Twitter の公開スレッドなど、外部から見えてしまう場所での報告はご遠慮ください。

暗号化を行う際の PGP 鍵は以下の通りです。

鍵指紋: `78E4 CFE0 B3B2 0C4C 7BAA A3CA 6554 A829 D251 53F9`

[pgp_keys.asc](https://keybase.io/m2en/pgp_keys.asc?fingerprint=78e4cfe0b3b20c4c7baaa3ca6554a829d25153f9)

また、これらの脆弱性をより早く解決するために、以下の情報をできる限り多く提供してください。

- 脆弱性の種類
  - (例: SQL インジェクション、コード・インジェクション、リソース管理の問題、設計上の問題、認可・権限・アクセス制御)
- 脆弱性に関連するソースファイルのフルパス
- 脆弱性に関連するソースコードのタグ、コミットハッシュ、permlink など
- 脆弱性を再現するために必要な特別な設定
- 問題を再現するための手順
- PoC(概念実証)(可能であれば)
- 脆弱性の影響
