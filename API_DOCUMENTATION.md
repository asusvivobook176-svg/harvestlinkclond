# 📖 HarvestLink API Documentation

This document outlines the core API endpoints for the HarvestLink platform. All API routes are prefixed with `/api`.

## 🔐 Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | `POST` | Create a new farmer/shop account. |
| `/auth/login` | `POST` | Authenticate and receive a JWT token. |
| `/auth/profile/<id>` | `GET` | Get user profile details. |

## 🤖 AI Services (ML)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/ai/crop-recommendations` | `POST` | Get top 3 crop suggestions based on soil/climate. |
| `/ai/demand-forecast` | `POST` | Get 30-day demand/price forecasts for a crop. |
| `/ai/price-alert-check` | `POST` | Check for immediate price crash risk. |
| `/ai/spoilage-check` | `POST` | Predict shelf life of harvested produce. |
| `/ai/save-recommendation/<id>`| `POST` | Track action taken on a recommendation. |

## 🛒 Marketplace
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/market/listings` | `GET/POST` | View all available crops or post a new listing. |
| `/market/demands` | `GET/POST` | View shop requirements or post a new demand. |
| `/market/prices` | `GET` | Get current market price averages per city. |

## 📊 Analytics
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analytics/farmer/revenue-trends` | `GET` | Revenue metrics for farmers. |
| `/api/analytics/admin/system-health` | `GET` | Overall app health and ML status. |

## 🩺 Monitoring
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/monitoring/model-health` | `GET` | Real-time health check for ML models. |

---
*Note: Routes requiring authentication expect an `Authorization: Bearer <token>` header.*
