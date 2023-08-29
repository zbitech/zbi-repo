{{/*
Expand the name of the chart.
*/}}
{{- define "zbi-control-plane.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "zbi-control-plane.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{- define "zbi-control-plane.databasename" -}}
{{- printf "%s-mongodb" (include "zbi-control-plane.fullname" .)}}
{{- end }}
{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "zbi-control-plane.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "zbi-control-plane.labels" -}}
helm.sh/chart: {{ include "zbi-control-plane.chart" . }}
{{ include "zbi-control-plane.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "zbi-control-plane.selectorLabels" -}}
app.kubernetes.io/name: {{ include "zbi-control-plane.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}


{{- define "zbi-control-plane.expressSelectorLabels" -}}
app.kubernetes.io/name: {{ include "zbi-control-plane.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}-mongo-express
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "zbi-control-plane.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "zbi-control-plane.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{- define "zbiControllerURL" -}}
{{- $fullName := include "zbi-control-plane.fullname" . }}
{{- printf "%s-svc.%s.service.cluster.local:%s" "zbi-controller" .Release.Namespace  (.Values.service.port | toString) }}
{{- end }}
