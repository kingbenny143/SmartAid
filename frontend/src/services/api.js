const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export const FALLBACK_SYMPTOMS_LIST = [
  { id: 'fever', name: 'Fever', category: 'General', description: 'Elevated body temperature, often a natural immune response to infection.' },
  { id: 'headache', name: 'Headache', category: 'General', description: 'Pain or discomfort in the head, temples, scalp, or neck area.' },
  { id: 'fatigue', name: 'Fatigue', category: 'General', description: 'Persistent tiredness, lethargy, or lack of physical and mental energy.' },
  { id: 'body_ache', name: 'Body Aches', category: 'General', description: 'Generalized muscular soreness, stiffness, or systemic bodily discomfort.' },
  { id: 'chills', name: 'Chills & Shivering', category: 'General', description: 'Feeling cold with involuntary shivering, often preceding or accompanying fever.' },
  { id: 'dizziness', name: 'Dizziness & Lightheadedness', category: 'General', description: 'Feeling lightheaded, unsteady, faint, or experiencing a spinning sensation.' },
  { id: 'cough', name: 'Cough', category: 'Respiratory', description: 'Sudden forceful expulsion of air from lungs, dry or producing mucus/phlegm.' },
  { id: 'sore_throat', name: 'Sore Throat', category: 'Respiratory', description: 'Scratchy, painful, or irritated sensation in the throat, often worse when swallowing.' },
  { id: 'runny_nose', name: 'Runny Nose & Sneezing', category: 'Respiratory', description: 'Nasal discharge, rhinorrhea, and frequent sneezing from irritation or infection.' },
  { id: 'congestion', name: 'Nasal & Sinus Congestion', category: 'Respiratory', description: 'Stuffy nose with feeling of fullness or pressure around the sinuses and forehead.' },
  { id: 'shortness_of_breath', name: 'Shortness of Breath', category: 'Respiratory', description: 'Feeling winded or struggling to breathe comfortably at rest or mild exertion.' },
  { id: 'nausea', name: 'Nausea', category: 'Digestive', description: 'Queasy stomach discomfort with the urge or sensation of needing to vomit.' },
  { id: 'vomiting', name: 'Vomiting', category: 'Digestive', description: 'Involuntary oral expulsion of stomach contents.' },
  { id: 'diarrhea', name: 'Diarrhea', category: 'Digestive', description: 'Frequent, loose, or watery bowel movements causing potential fluid loss.' },
  { id: 'stomach_pain', name: 'Stomach & Abdominal Pain', category: 'Digestive', description: 'Cramping, aching, or localized discomfort in the abdominal area.' },
  { id: 'joint_pain', name: 'Joint Stiffness & Pain', category: 'Musculoskeletal', description: 'Soreness, inflammation, or restricted movement in knees, wrists, or other joints.' },
  { id: 'back_pain', name: 'Back Pain', category: 'Musculoskeletal', description: 'Aching or sharp tension along the lumbar spine or upper shoulder region.' },
  { id: 'rash', name: 'Skin Rash or Irritation', category: 'Dermatological', description: 'Redness, itchiness, bumps, or localized skin eruption.' },
  { id: 'earache', name: 'Ear Pain', category: 'ENT', description: 'Dull ache, sharp throb, or feeling of pressure within one or both ears.' },
  { id: 'loss_of_taste_smell', name: 'Loss of Taste or Smell', category: 'ENT', description: 'Sudden or gradual reduction in ability to smell aromas or taste flavors.' },
  { id: 'insomnia', name: 'Sleep Disturbance', category: 'General', description: 'Difficulty falling asleep, staying asleep, or unrefreshing fragmented sleep.' },
]

let cachedSymptoms = null

export function getSymptomsList() {
  return cachedSymptoms || FALLBACK_SYMPTOMS_LIST
}

export async function fetchSymptoms() {
  try {
    const res = await request('/api/symptoms')
    if (res && res.symptoms && Array.isArray(res.symptoms)) {
      cachedSymptoms = res.symptoms
      return res
    }
  } catch (err) {
    console.warn('Could not fetch dynamic symptoms from backend, using fallback list:', err.message)
  }
  return {
    symptoms: FALLBACK_SYMPTOMS_LIST,
    categories: ['General', 'Respiratory', 'Digestive', 'Musculoskeletal', 'Dermatological', 'ENT'],
    count: FALLBACK_SYMPTOMS_LIST.length,
  }
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`${res.status} ${text}`)
  }
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json()
  return res.text()
}

export async function checkBackendHealth() {
  return request('/health')
}

export async function assessSymptoms({ symptoms, duration, severity }) {
  return request('/api/symptoms/assess', {
    method: 'POST',
    body: JSON.stringify({ symptoms, duration, severity }),
  })
}

export async function getFirstAidGuides(params = {}) {
  const query = new URLSearchParams()
  if (params.category) query.set('category', params.category)
  if (params.q) query.set('q', params.q)
  const qs = query.toString() ? `?${query.toString()}` : ''
  return request(`/api/firstaid${qs}`)
}

export async function getFirstAidGuideById(topicId) {
  return request(`/api/firstaid/${encodeURIComponent(topicId)}`)
}

export async function sendChatMessage({ message, history = [] }) {
  return request('/api/chat', {
    method: 'POST',
    body: JSON.stringify({
      message,
      history: history.map((h) => ({ role: h.role, content: h.content })),
    }),
  })
}
