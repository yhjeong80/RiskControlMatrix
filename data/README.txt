RCM Sample Data Model

Files included:
- users.json
- folders.json
- risks.json
- controls.json
- change_logs.json

Recommended relationship keys:
- users.userId
- folders.folderId
- folders.parentFolderId
- risks.riskId
- risks.folderId
- risks.ownerUserId
- controls.controlId
- controls.riskId
- change_logs.targetId

Risk Rating Rule:
- Score = Likelihood x Impact
- 1~6 = Low
- 7~14 = Medium
- 15~25 = High

Recommended next implementation step:
1. Replace hardcoded tree data with folders.json
2. Replace current table rows with risks.json
3. Add create/update/delete logging into change_logs.json structure
4. Add JSON/CSV/XLSX export
5. Keep IDs stable for future DB / Power BI / KNIME integration
