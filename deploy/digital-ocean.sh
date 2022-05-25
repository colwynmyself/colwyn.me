#!/usr/bin/env bash

if ! command -v curl &> /dev/null
then
    echo "curl must be installed to run this script."
    exit 1
fi

if ! command -v jq &> /dev/null
then
    echo "jq must be installed to run this script."
    exit 1
fi

if [[ -z "${DIGITALOCEAN_TOKEN}" || -z "${DIGITALOCEAN_APP_ID}" ]]; then
  echo "The environment variables DIGITALOCEAN_TOKEN and DIGITALOCEAN_APP_ID must be provided."
  exit 1
fi

function log() {
  echo "$(date +'%Y-%m-%d %T') - ${1}"
}

DEPLOYMENT=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${DIGITALOCEAN_TOKEN}" \
  "https://api.digitalocean.com/v2/apps/${DIGITALOCEAN_APP_ID}/deployments"
)
DEPLOYMENT_ID=$(echo "${DEPLOYMENT}" | jq -r '.deployment.id')

log "Deployment ${DEPLOYMENT_ID} created."

ERROR_COUNT=0
UNKNOWN_PHASE_COUNT=0
while true; do
  STATE=$(curl -s -X GET \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${DIGITALOCEAN_TOKEN}" \
    "https://api.digitalocean.com/v2/apps/${DIGITALOCEAN_APP_ID}/deployments/${DEPLOYMENT_ID}"
  )
  ERROR=$(echo "${STATE}" | jq -r '.error')
  PHASE=$(echo "${STATE}" | jq -r '.deployment.phase')

  if [[ "${ERROR}" != "null" ]]; then
    ((ERROR_COUNT++))
    log "Error number ${ERROR_COUNT} encountered. Message: ${ERROR}"

    # This is arbitrary, I just figure more than 3 errors is probably too many
    # I should really check for what the error is, but that can come later
    if [ "${ERROR_COUNT}" -gt 3 ]; then
      log "That's too many errors in a row, exiting"
      echo "${STATE}" | jq
      exit 1
    fi
  elif [[ "${PHASE}" == "PENDING_BUILD" || "${PHASE}" == "DEPLOYING" || "${PHASE}" == "BUILDING" ]]; then
    log "Waiting for deployment to finish. Current in phase ${PHASE}"
  elif [[ "${PHASE}" == "ACTIVE" ]]; then
    log "Deployment ${DEPLOYMENT_ID} was successful!"
    break
  elif [[ "${PHASE}" == "SUPERSEDED" ]]; then
    log """
Deployment ${DEPLOYMENT_ID} was superseded by another deployment. This is fine so we'll break the loop.
  Hint: Two commits were likely made within a few minutes of each other.
"""
    break
  else
    # This can happen for a number of reasons, basically just wait a bit to see if it resolves itself
    ((UNKNOWN_PHASE_COUNT++))
    log "Unknown phase ${PHASE}. ${UNKNOWN_PHASE_COUNT} unknown phases encountered in a row."

    if [ "${UNKNOWN_PHASE_COUNT}" -gt 5 ]; then
      log "At this point, assuming this is an error and exiting. Also here's the whole state."
      echo "${STATE}" | jq
      exit 1
    else
      log "Waiting a few extra seconds to see if it resolves itself"
      sleep 4
    fi
  fi

  sleep 1
done
