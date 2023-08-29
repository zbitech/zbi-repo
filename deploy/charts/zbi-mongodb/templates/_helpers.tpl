{{/*
Expand the name of the chart.
*/}}
{{- define "zbi-mongodb.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "zbi-mongodb.fullname" -}}
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

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "zbi-mongodb.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "zbi-mongodb.labels" -}}
helm.sh/chart: {{ include "zbi-mongodb.chart" . }}
{{ include "zbi-mongodb.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "zbi-mongodb.selectorLabels" -}}

app.kubernetes.io/name: {{ include "zbi-mongodb.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "zbi-mongodb.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "zbi-mongodb.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Create database connection string
*/}}
{{- define "db.ConnectionString" -}}
{{- if .Values.database.enabled}}

{{- $fullName := include "zbi-mongodb.fullname" . }}

{{- $secretName := printf "%s-%s" $fullName "zbirepo-zbi"}}

{{- $secretObj := (lookup "v1" "Secret" .Release.Namespace $secretName) | default dict }}
{{- $secretData := (get $secretObj "data") | default dict }}

{{- if .Values.database.tls.enabled }}
{{- (get $secretData "connectionString.standardSrv") | b64dec }}
{{- else }}
{{- (get $secretData "connectionString.standard") | b64dec }}
{{- end }}

{{- else }}
{{- print "admin" -}}
{{- end }}
{{- end }}

{{/*
database secret name
*/}}
{{- define "db.SecretName" -}}
{{- $fullName := include "zbi-mongodb.fullname" . }}

{{- printf "%s-admin" $fullName }}

{{- end }}

{{- define "db.ConnectionStringName" -}}
{{- if .Values.database.tls.enabled}}
{{- "connectionString.standardSrv" }}
{{- else }}
{{- "connectionString.standard" }}
{{- end }}
{{- end }}
