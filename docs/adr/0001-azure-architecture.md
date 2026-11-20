# ADR 0001: Azure architecture for serve.

- **Status:** Proposed. Waiting on Jarred's sign-off on cost.
- **Date:** 2026-11-20
- **ClickUp:** [CU-86bd5gn29](https://app.clickup.com/t/86bd5gn29), Story [CU-86bd5gn0v](https://app.clickup.com/t/86bd5gn0v)

## Context

serve. starts on Render + Neon to ship quickly. The Azure move is a deliberate portfolio piece: infrastructure as code (Bicep), a GitHub Actions pipeline using OIDC, and secrets and monitoring the way a production team would do them. Constraints:

- Traffic is one church's volunteers: tens of users, bursts around Sunday scheduling.
- Target cost: **about $0 per month**, and never a surprise bill.
- The API will already be a Docker image (CI + Docker Story), so it should run unchanged.

## Decision

| Piece | Choice | Why | Rejected alternative |
|---|---|---|---|
| API | **Azure Container Apps**, Consumption plan, scale to zero | Runs the same Docker image as local and CI; per-second billing inside a monthly free grant | **App Service F1:** free, but runs code rather than our container, with tight CPU quotas and no always-on. **AKS:** far too much for this load |
| Frontend | **Azure Static Web Apps, Free plan** | Free static hosting with CDN and TLS, plus a GitHub Actions deploy | Blob static website + Front Door: more pieces and Front Door costs money |
| Database | **Keep Neon** (Postgres, free tier) | Already set up; free with no time limit; reachable from Azure over TLS | **Azure Database for PostgreSQL Flexible Server B1ms:** free for 12 months on a *new* free account only, then billed hourly, which breaks the $0 target |
| Image registry | **GitHub Container Registry (ghcr.io)** | Free; lives next to the code; GitHub Actions can push without extra secrets | **Azure Container Registry Basic:** small fixed monthly fee with nothing gained at this scale |
| Secrets | **Azure Key Vault**, referenced by Container Apps through a managed identity | Industry-standard pattern; no secrets in app settings or GitHub | Container Apps built-in secrets: fine, but less to show |
| Monitoring | **Application Insights + Log Analytics** | Request logs, errors, an availability test and alert | (none) |
| Deploy auth | **GitHub Actions → Azure via OIDC federated credential** | No long-lived Azure keys stored anywhere | Service principal secret in GitHub: works, but a stored credential |
| IaC | **Bicep** | Azure-native, readable, first-class tooling; matches Azure experience | Terraform: equally valid; choose it instead if multi-cloud matters more |

```
GitHub (main) --Actions + OIDC--> Azure
                                   |-- Static Web App (React build)      --HTTPS--> users
                                   |-- Container App (API image from ghcr.io)
                                   |      |-- managed identity -> Key Vault (DATABASE_URL, SECRET_KEY, GOOGLE_CLIENT_ID)
                                   |      '-- App Insights / Log Analytics
                                   '----------------------------------------> Neon Postgres (TLS)
```

## Cost (as of 2026-11; re-check before applying)

| Resource | Free allowance | Expected serve. usage | Expected cost |
|---|---|---|---|
| Container Apps (Consumption) | 180,000 vCPU-s, 360,000 GiB-s, 2M requests per month, **per subscription** | Scales to zero; small bursts | $0 |
| Static Web Apps (Free) | 100 GB bandwidth, 10 apps, 2 custom domains | A few hundred MB | $0 |
| Key Vault | (no free tier; billed per 10k operations) | A few thousand reads | under $0.10 |
| Log Analytics / App Insights | First 5 GB ingestion per month free | Well under 1 GB | $0 |
| Neon | Free tier | Small | $0 |
| **Total** | | | **about $0–1 per month** |

Guardrails: an Azure **budget alert at $5/month** (defined in Bicep), Container Apps `maxReplicas: 2`, and a 30-day Log Analytics retention.

Risks:
- The Container Apps free grant is shared by *every* Consumption app in the subscription, so other experiments in the same subscription eat into it.
- Scale-to-zero means a cold start of a few seconds on the first request. Setting `minReplicas: 1` removes that but is billed as idle time.

## Consequences

- Bicep templates under `infra/` define everything, including the budget alert. Re-running them changes nothing.
- The Render deployment can stay as a fallback until the cut-over task decides.
- Google sign-in needs the Static Web App URL added to its authorized origins at cut-over.

## Sources

- Container Apps free grant: [freetier.co](https://freetier.co/directory/products/azure-container-apps), [Microsoft Q&A](https://learn.microsoft.com/en-us/answers/questions/5560085/ongoing-costs-for-azure-container-app-environment)
- Static Web Apps quotas: [Microsoft Learn](https://learn.microsoft.com/en-us/azure/static-web-apps/quotas)
- Azure PostgreSQL 12-month free offer: [Microsoft Learn](https://learn.microsoft.com/en-ie/azure/postgresql/flexible-server/how-to-deploy-on-azure-free-account)
