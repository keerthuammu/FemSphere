import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Flame, Heart, Footprints, Clock, Plus, Check, Zap, Sparkles, Award, 
  Dumbbell, Droplets, Utensils, TrendingUp, ChevronRight, Apple, Search, X, 
  Calendar, RotateCcw, Target, ShieldCheck, PieChart, Info, Play, Pause, 
  SkipForward, SkipBack, Music, Camera, Settings, ThumbsUp, ThumbsDown, HelpCircle,
  Volume2, VolumeX, CheckCircle2, ChevronLeft, ChevronRight as RightArrow,
  RefreshCw, Minus, Plus as PlusIcon
} from 'lucide-react';

export interface Exercise {
  id: string;
  name: string;
  category: string;
  durationSeconds: number;
  repetitionCount: number;
  calories: number;
  difficulty: string;
  focusAreas: string[];
  clinicalIndications?: string[]; // e.g. ['PCOS Safe', 'Prenatal Safe', 'Diastasis Safe', 'Menstrual Relief', 'Bone Density']
  clinicalContraindications?: string[]; // e.g. ['Avoid in 3rd Trimester', 'Avoid in acute flare']
  instructions: string;
  instructionsFull: string;
  biomechanicsSteps: string[];
  tips: string[];
  restDurationSeconds: number;
  animationType: string;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  category: string;
  patientCondition: 'pcos' | 'prenatal' | 'postpartum' | 'menstrual' | 'menopause' | 'cardio' | 'general';
  clinicalApproval: string; // e.g. 'OB/GYN & Pelvic Health Approved'

  targetHeartRateBpm: string;
  safetySafeguards: string;
  durationMinutes: number;
  caloriesBurned: number;
  level: string;
  description: string;
  exercises: Exercise[];
}

export const EXERCISE_CATALOG: Exercise[] = [
  {
    id: 'squats',
    name: 'SQUATS',
    category: 'Lower Body Strength',
    durationSeconds: 30,
    repetitionCount: 15,
    calories: 30,
    difficulty: 'Beginner',
    focusAreas: ['Glutes', 'Quadriceps', 'Hamstrings', 'Pelvic Floor'],
    instructions: 'Feet shoulder-width apart, hips hinge backward and downward, knees bend to 90 degrees and track over feet, return to standing.',
    instructionsFull: '1. Start standing upright with feet shoulder-width apart.\n2. Keep chest upright and back neutral.\n3. Bend knees and push hips backward.\n4. Lower body until thighs are parallel to the floor (90 degrees).\n5. Keep knees aligned with feet (do not collapse inward).\n6. Drive through heels to return to standing position.',
    biomechanicsSteps: [
      'Feet remain stationary shoulder-width apart',
      'Hips hinge back and down to 90-degree thigh depth',
      'Knees track over second toe without valgus collapse',
      'Torso remains upright with neutral spine',
    ],
    tips: ['Weight in heels', 'Keep chest open and proud', 'Exhale rising up'],
    restDurationSeconds: 15,
    animationType: 'squats',
  },
  {
    id: 'jumping_jacks',
    name: 'JUMPING JACKS',
    category: 'Cardio & Lymphatic',
    durationSeconds: 30,
    repetitionCount: 25,
    calories: 35,
    difficulty: 'All Levels',
    focusAreas: ['Shoulders', 'Quadriceps', 'Calves', 'Cardiovascular'],
    instructions: 'Start standing with feet together and arms down. Jump feet outward while raising arms overhead. Return feet together while lowering arms.',
    instructionsFull: '1. Start standing upright with feet together and arms at sides.\n2. Jump slightly off the ground, spreading feet shoulder-width apart.\n3. Simultaneously swing arms outward and overhead.\n4. Land softly on balls of feet.\n5. Jump back to starting position with feet together and arms at sides.',
    biomechanicsSteps: [
      'Soft knee landings to absorb impact',
      'Arms swing through full lateral arc overhead',
      'Cadence remains steady and rhythmic',
    ],
    tips: ['Land softly on balls of feet', 'Keep core engaged', 'Breathe smoothly'],
    restDurationSeconds: 15,
    animationType: 'jumping_jacks',
  },
  {
    id: 'lunges',
    name: 'FORWARD LUNGES',
    category: 'Lower Body & Balance',
    durationSeconds: 30,
    repetitionCount: 14,
    calories: 28,
    difficulty: 'Intermediate',
    focusAreas: ['Quadriceps', 'Gluteus Medius', 'Hip Flexors'],
    instructions: 'One leg steps forward, front knee bends tracking over foot, rear knee moves toward floor, torso remains upright, return to start.',
    instructionsFull: '1. Start standing tall with feet hip-width apart.\n2. Step forward with right foot.\n3. Lower hips until both front and back knees form 90-degree angles.\n4. Front knee stays aligned directly above front ankle.\n5. Push through front heel to return to standing position.\n6. Alternate sides.',
    biomechanicsSteps: [
      'Vertical torso posture throughout',
      'Front knee stacked over ankle at 90 degrees',
      'Back knee hovers 2 inches above ground',
      'Hips stay level and square',
    ],
    tips: ['Drive through front heel', 'Keep torso tall and vertical'],
    restDurationSeconds: 15,
    animationType: 'lunges',
  },
  {
    id: 'high_knees',
    name: 'HIGH KNEES',
    category: 'HIIT Cardio',
    durationSeconds: 30,
    repetitionCount: 30,
    calories: 40,
    difficulty: 'Intermediate',
    focusAreas: ['Hip Flexors', 'Lower Abs', 'Cardiovascular'],
    instructions: 'Remain upright and alternate lifting each knee toward chest while maintaining a controlled running-in-place movement.',
    instructionsFull: '1. Stand tall with feet hip-width apart.\n2. Lift right knee up to hip height (90 degrees).\n3. Switch explosively to left knee while pumping arms in rhythm.\n4. Stay on balls of feet with upright posture.',
    biomechanicsSteps: [
      'Knee reaches true 90-degree hip level',
      'Ankle dorsiflexed on lifting leg',
      'Torso stays vertical with slight forward lean',
      'Light, bouncy landings on forefeet',
    ],
    tips: ['Stay light on toes', 'Pump arms in rhythm'],
    restDurationSeconds: 15,
    animationType: 'high_knees',
  },
  {
    id: 'glute_bridge',
    name: 'GLUTE BRIDGE',
    category: 'Glute & Pelvic Health',
    durationSeconds: 30,
    repetitionCount: 15,
    calories: 22,
    difficulty: 'Beginner',
    focusAreas: ['Gluteus Maximus', 'Hamstrings', 'Pelvic Floor'],
    instructions: 'Lie on back with knees bent and feet planted. Lift hips upward forming a straight diagonal line to shoulders, lower controlled.',
    instructionsFull: '1. Lie supine on back with knees bent and feet flat on floor hip-width apart.\n2. Arms rest alongside torso on the floor.\n3. Drive through heels to lift hips and pelvis upward.\n4. Form a straight diagonal line from knees down to shoulders.\n5. Squeeze glutes firmly at top for 1 second.\n6. Lower hips slowly back to floor.',
    biomechanicsSteps: [
      'Feet planted flat on floor hip-width apart',
      'Drive initiated through heels (not lower back)',
      'Peak height creates straight diagonal from knees to shoulders',
      'Ribcage stays down with active core',
    ],
    tips: ['Press firmly through heels', 'Do not arch lower back excessively'],
    restDurationSeconds: 15,
    animationType: 'glute_bridge',
  },
  {
    id: 'push_ups',
    name: 'PUSH-UPS',
    category: 'Upper Body & Core',
    durationSeconds: 30,
    repetitionCount: 12,
    calories: 26,
    difficulty: 'Intermediate',
    focusAreas: ['Pectorals', 'Triceps', 'Anterior Deltoids', 'Core'],
    instructions: 'Hands remain planted, body stays in straight line, elbows bend at 45 degrees, chest moves toward floor, then push back up.',
    instructionsFull: '1. Start in a rigid high plank with hands shoulder-width apart.\n2. Maintain a straight line from head to heels.\n3. Lower chest to floor bending elbows at a 45-degree arrow angle.\n4. Lower until chest hovers just above ground.\n5. Press firmly through palms to return to top plank.',
    biomechanicsSteps: [
      'Rigid head-to-heel straight body line',
      'Elbows bend at 45-degree arrow angle (not flared 90°)',
      'Full arm lockout at top of repetition',
    ],
    tips: ['Squeeze glutes and core', 'Keep neck neutral'],
    restDurationSeconds: 15,
    animationType: 'push_ups',
  },
  {
    id: 'plank',
    name: 'PLANK HOLD',
    category: 'Core & Stability',
    durationSeconds: 30,
    repetitionCount: 1,
    calories: 25,
    difficulty: 'All Levels',
    focusAreas: ['Transverse Abdominis', 'Core Stabilizers', 'Lower Back'],
    instructions: 'Body remains in a straight line from head to heels, core remains stable, elbows/hands stay fixed, no unnecessary hip movement.',
    instructionsFull: '1. Place forearms on ground with elbows directly under shoulders.\n2. Extend legs back resting on balls of feet.\n3. Create a straight line from crown of head to heels.\n4. Draw navel in tightly toward spine.\n5. Hold position without allowing hips to drop or pike.',
    biomechanicsSteps: [
      'Forearms flat under shoulders',
      'Posterior pelvic tilt engaging lower abs',
      'Continuous deep diaphragmatic breathing',
    ],
    tips: ['Squeeze glutes tight', 'Do not let hips sag'],
    restDurationSeconds: 15,
    animationType: 'plank',
  },
  {
    id: 'side_leg_raises',
    name: 'SIDE LEG RAISES',
    category: 'Hip & Glute Tone',
    durationSeconds: 30,
    repetitionCount: 16,
    calories: 20,
    difficulty: 'Beginner',
    focusAreas: ['Gluteus Medius', 'Outer Thighs', 'Hip Stabilizers'],
    instructions: 'Maintain balance with supporting leg stable. Raise opposite leg sideways in controlled motion without rotating torso.',
    instructionsFull: '1. Stand upright with hands on hips for balance.\n2. Keep left leg planted firmly.\n3. Raise right leg straight out to side to approximately 45 degrees.\n4. Keep toes pointing forward (not rotated upward).\n5. Pause for a fraction of a second, then lower with control.',
    biomechanicsSteps: [
      'Pure lateral hip abduction to 45 degrees',
      'Toes point straight forward (no external rotation)',
      'Torso remains completely upright without leaning',
    ],
    tips: ['Do not tilt torso', 'Keep core braced'],
    restDurationSeconds: 15,
    animationType: 'side_leg_raises',
  },
  {
    id: 'arm_circles',
    name: 'ARM CIRCLES',
    category: 'Shoulder Sculpt',
    durationSeconds: 30,
    repetitionCount: 20,
    calories: 25,
    difficulty: 'All Levels',
    focusAreas: ['Deltoids', 'Upper Back', 'Rotator Cuff'],
    instructions: 'Extend arms horizontally straight out at shoulder level. Make controlled 360-degree circular motions clockwise without swaying.',
    instructionsFull: '1. Stand upright with feet shoulder-width apart.\n2. Extend arms straight out horizontally at shoulder height.\n3. Palms face downward with arms fully straight.\n4. Make small, controlled circular motions clockwise.\n5. Shoulders stay relaxed away from ears.\n6. Torso remains completely still.',
    biomechanicsSteps: [
      'Arms locked straight at 90-degree horizontal line',
      'Pure glenohumeral rotation without shoulder elevation',
      'Torso stays motionless and upright',
    ],
    tips: ['Keep shoulder blades down', 'Maintain relaxed neck'],
    restDurationSeconds: 15,
    animationType: 'arm_circles',
  },
  {
    id: 'mountain_climbers',
    name: 'MOUNTAIN CLIMBERS',
    category: 'Core & Cardio',
    durationSeconds: 30,
    repetitionCount: 28,
    calories: 38,
    difficulty: 'Intermediate',
    focusAreas: ['Abdominals', 'Deltoids', 'Quadriceps'],
    instructions: 'Start in a high plank. Keep hands planted while alternating bringing each knee toward chest. Maintain stable upper body.',
    instructionsFull: '1. Start in a rigid high plank position.\n2. Drive right knee straight in toward chest without touching floor.\n3. Quickly switch and drive left knee in as right leg extends back.\n4. Keep hips level and stable throughout.',
    biomechanicsSteps: [
      'Hands planted directly under shoulders',
      'Knees drive along sagittal center under torso',
      'Hips remain level with spine without bouncing',
    ],
    tips: ['Keep hands firmly planted', 'Do not bounce hips up'],
    restDurationSeconds: 15,
    animationType: 'mountain_climbers',
  },
  {
    id: 'butt_kicks',
    name: 'BUTT KICKS',
    category: 'Cardio & Warmup',
    durationSeconds: 30,
    repetitionCount: 30,
    calories: 32,
    difficulty: 'Beginner',
    focusAreas: ['Hamstrings', 'Quadriceps Stretch', 'Cardiovascular'],
    instructions: 'Jog in place on balls of feet, kicking heels up to touch glutes on every stride while keeping knees pointing down.',
    instructionsFull: '1. Stand upright with feet hip-width apart.\n2. Jog in place on balls of feet.\n3. Flex knees backwards so heels kick upward toward glutes.\n4. Keep thighs perpendicular to ground.',
    biomechanicsSteps: [
      'Knees point directly toward floor',
      'Heels travel straight upward to contact glutes',
      'Light bouncy cadence on forefeet',
    ],
    tips: ['Chest upright', 'Keep knees down'],
    restDurationSeconds: 15,
    animationType: 'butt_kicks',
  },
  {
    id: 'bicycle_crunches',
    name: 'BICYCLE CRUNCHES',
    category: 'Obliques & Core',
    durationSeconds: 30,
    repetitionCount: 20,
    calories: 30,
    difficulty: 'Intermediate',
    focusAreas: ['Obliques', 'Rectus Abdominis', 'Hip Flexors'],
    instructions: 'Lie on back, elevate shoulder blades, and alternate driving elbow to opposite knee while extending other leg straight.',
    instructionsFull: '1. Lie on back with hands behind head.\n2. Lift shoulder blades and feet off floor.\n3. Rotate torso driving right elbow toward left knee while extending right leg.\n4. Switch sides fluidly.',
    biomechanicsSteps: [
      'Shoulder blades stay elevated off floor',
      'Torso rotates from thoracic spine toward knee',
      'Opposite leg extends straight at 45-degree angle',
    ],
    tips: ['Do not pull on neck', 'Rotate with core'],
    restDurationSeconds: 15,
    animationType: 'bicycle_crunches',
  },
  {
    id: 'bird_dog',
    name: 'BIRD DOG',
    category: 'Spine & Core Stability',
    durationSeconds: 30,
    repetitionCount: 14,
    calories: 20,
    difficulty: 'Beginner',
    focusAreas: ['Erector Spinae', 'Glutes', 'Core Stabilizers'],
    instructions: 'Start on hands and knees. Extend opposite arm and leg while keeping spine stable. Return to start position and alternate.',
    instructionsFull: '1. Start on all fours with hands under shoulders and knees under hips.\n2. Extend right arm straight forward and left leg straight backward.\n3. Reach until arm and leg are parallel to floor.\n4. Hold 2 seconds maintaining flat back.\n5. Return to start and repeat on opposite side.',
    biomechanicsSteps: [
      'Spine remains neutral (no lumbar arching)',
      'Arm and leg reach parallel to floor line',
      'Hips stay square to floor',
    ],
    tips: ['Keep hips level', 'Reach straight out'],
    restDurationSeconds: 15,
    animationType: 'bird_dog',
  },
  {
    id: 'standing_knee_raises',
    name: 'STANDING KNEE RAISES',
    category: 'Core & Hip Flexors',
    durationSeconds: 30,
    repetitionCount: 20,
    calories: 25,
    difficulty: 'Beginner',
    focusAreas: ['Lower Abs', 'Hip Flexors', 'Balance'],
    instructions: 'Stand tall and raise one knee to chest level contracting abdominals, lower with control and alternate.',
    instructionsFull: '1. Stand tall with feet hip-width apart.\n2. Raise right knee up to chest level contracting lower abs.\n3. Lower with control and repeat on left side.',
    biomechanicsSteps: [
      'Supporting leg planted with micro-bend',
      'Knee lifts to 90 degrees with active core crunch',
      'Controlled eccentric descent',
    ],
    tips: ['Keep chest up', 'Exhale lifting knee'],
    restDurationSeconds: 15,
    animationType: 'high_knees',
  },
  {
    id: 'calf_raises',
    name: 'CALF RAISES',
    category: 'Lower Leg Strength',
    durationSeconds: 30,
    repetitionCount: 20,
    calories: 18,
    difficulty: 'Beginner',
    focusAreas: ['Gastrocnemius', 'Soleus', 'Ankle Stability'],
    instructions: 'Stand shoulder-width apart, press through balls of feet lifting heels high, pause for 1 second and lower slowly.',
    instructionsFull: '1. Stand with feet shoulder-width apart.\n2. Press through balls of feet to elevate heels as high as possible.\n3. Hold at peak contraction for 1 second.\n4. Lower heels slowly back to floor.',
    biomechanicsSteps: [
      'Pure vertical lift without forward torso lean',
      'Full plantarflexion onto big toe metatarsals',
      'Slow 2-second controlled lowering',
    ],
    tips: ['Pause at the top', 'Control the descent'],
    restDurationSeconds: 15,
    animationType: 'calf_raises',
  },
  {
    id: 'crunches',
    name: 'CRUNCHES',
    category: 'Abdominal Strength',
    durationSeconds: 30,
    repetitionCount: 18,
    calories: 22,
    difficulty: 'Beginner',
    focusAreas: ['Upper Abs', 'Rectus Abdominis'],
    instructions: 'Lie on back with knees bent. Curl ribcage toward pelvis lifting shoulder blades off floor, lower slowly.',
    instructionsFull: '1. Lie supine on back with knees bent and feet flat.\n2. Hands placed behind head or crossed over chest.\n3. Contract abdominals to lift shoulder blades 3-4 inches off floor.\n4. Lower slowly with control.',
    biomechanicsSteps: [
      'Lower back stays pressed flat into floor',
      'Thoracic flexion lifts shoulder blades 3-4 inches',
      'Chin stays off chest with gaze toward ceiling',
    ],
    tips: ['Do not yank neck', 'Exhale on crunch'],
    restDurationSeconds: 15,
    animationType: 'crunches',
  },
  {
    id: 'russian_twists',
    name: 'RUSSIAN TWISTS',
    category: 'Obliques & Rotation',
    durationSeconds: 30,
    repetitionCount: 24,
    calories: 32,
    difficulty: 'Intermediate',
    focusAreas: ['Obliques', 'Transverse Abdominis', 'Hip Flexors'],
    instructions: 'Sit in V-sit position with feet hovered. Rotate torso from left to right touching hands to floor on each side.',
    instructionsFull: '1. Sit on floor with knees bent, lean torso back at 45 degrees.\n2. Clasp hands in front of chest.\n3. Rotate torso fully to right touching floor, then rotate to left.',
    biomechanicsSteps: [
      'Torso held at 45-degree angle with straight spine',
      'Shoulders rotate fully side to side',
      'Knees and hips stay stable and centered',
    ],
    tips: ['Rotate from ribcage', 'Keep chest open'],
    restDurationSeconds: 15,
    animationType: 'russian_twists',
  },
  {
    id: 'step_ups',
    name: 'STEP-UPS',
    category: 'Lower Body Power',
    durationSeconds: 30,
    repetitionCount: 16,
    calories: 34,
    difficulty: 'Intermediate',
    focusAreas: ['Quadriceps', 'Glutes', 'Balance'],
    instructions: 'Plant lead foot firmly on step. Drive through heel to stand straight up on platform, step down and alternate.',
    instructionsFull: '1. Stand in front of step or bench.\n2. Place entire right foot on platform.\n3. Drive through heel to extend right leg straight.\n4. Step down with left foot and repeat.',
    biomechanicsSteps: [
      'Entire foot planted flat on step',
      'Drive through lead heel to full knee extension',
      'Controlled step back to floor',
    ],
    tips: ['Do not push off back toe', 'Stand tall at peak'],
    restDurationSeconds: 15,
    animationType: 'lunges',
  },
  {
    id: 'wall_sit',
    name: 'WALL SIT',
    category: 'Isometric Quad Endurance',
    durationSeconds: 30,
    repetitionCount: 1,
    calories: 25,
    difficulty: 'Intermediate',
    focusAreas: ['Quadriceps', 'Glutes', 'Calves'],
    instructions: 'Slide back down wall until thighs are parallel to floor at 90 degrees. Hold position with arms extended.',
    instructionsFull: '1. Stand with back flat against wall.\n2. Slide down until thighs are parallel to floor (90-degree knee bend).\n3. Keep knees directly above ankles.\n4. Hold position for full duration.',
    biomechanicsSteps: [
      'Thighs parallel to floor (90-degree knee bend)',
      'Back pressed flat against wall',
      'Knees stacked directly over ankles',
    ],
    tips: ['Keep weight in heels', 'Breathe steadily'],
    restDurationSeconds: 15,
    animationType: 'squats',
  },
  {
    id: 'child_pose',
    name: 'CHILD\'S POSE',
    category: 'Recovery & Flexibility',
    durationSeconds: 30,
    repetitionCount: 1,
    calories: 12,
    difficulty: 'All Levels',
    focusAreas: ['Spine Lengthening', 'Hips', 'Shoulders', 'Relaxation'],
    instructions: 'Kneel with knees wide, sit hips back onto heels, reach arms forward along floor and rest forehead down.',
    instructionsFull: '1. Kneel on mat with big toes touching and knees wide.\n2. Lower hips back onto heels.\n3. Walk hands forward stretching arms out flat on floor.\n4. Rest forehead down and breathe deeply.',
    biomechanicsSteps: [
      'Hips sink deeply onto heels',
      'Arms reach forward active along floor',
      'Deep diaphragmatic breathing expanding ribcage',
    ],
    tips: ['Relax jaw and shoulders', 'Breathe into lower back'],
    restDurationSeconds: 15,
    animationType: 'child_pose',
  },
  {
    id: 'cat_cow',
    name: 'CAT-COW STRETCH',
    category: 'Spine Mobility',
    durationSeconds: 30,
    repetitionCount: 10,
    calories: 15,
    difficulty: 'All Levels',
    focusAreas: ['Spine Mobility', 'Neck', 'Pelvic Alignment'],
    instructions: 'On all fours, inhale to arch back and lift chest (Cow), exhale to round spine and tuck chin (Cat).',
    instructionsFull: '1. Start on hands and knees with neutral spine.\n2. Inhale: drop belly toward mat, lift chest and tailbone (Cow).\n3. Exhale: tuck chin, arch spine toward ceiling (Cat).\n4. Repeat with breath.',
    biomechanicsSteps: [
      'Inhale: belly drops, pelvis tilts anteriorly, chest opens',
      'Exhale: spine domes upward, pelvis tucks, chin to chest',
      'Fluid sequential articulation of vertebrae',
    ],
    tips: ['Flow with the breath', 'Hands under shoulders'],
    restDurationSeconds: 15,
    animationType: 'cat_cow',
  },
  {
    id: 'hip_flexor_stretch',
    name: 'HIP FLEXOR STRETCH',
    category: 'Pelvic & Hip Mobility',
    durationSeconds: 30,
    repetitionCount: 2,
    calories: 14,
    difficulty: 'All Levels',
    focusAreas: ['Psoas', 'Iliacus', 'Quadriceps', 'Posture'],
    instructions: 'Half-kneeling lunge position. Tuck tailbone under and gently shift hips forward to stretch front of rear hip.',
    instructionsFull: '1. Kneel on left knee, place right foot flat in front.\n2. Keep torso tall and tuck tailbone under.\n3. Gently shift hips forward until stretch is felt in front of left hip.\n4. Hold and switch sides.',
    biomechanicsSteps: [
      'Posterior pelvic tilt engages glute on rear leg',
      'Torso stays vertical without overarching lower back',
      'Gentle forward shift into anterior hip stretch',
    ],
    tips: ['Squeeze back glute', 'Keep torso tall'],
    restDurationSeconds: 15,
    animationType: 'lunges',
  },
  {
    id: 'hamstring_stretch',
    name: 'HAMSTRING STRETCH',
    category: 'Posterior Chain Flexibility',
    durationSeconds: 30,
    repetitionCount: 2,
    calories: 14,
    difficulty: 'All Levels',
    focusAreas: ['Hamstrings', 'Calves', 'Lower Back'],
    instructions: 'Extend one leg forward with heel on ground and toes up. Hinge at hips with flat back reaching toward toes.',
    instructionsFull: '1. Stand with right heel forward and toes pulled up.\n2. Bend left knee slightly and hinge at hips pushing buttocks back.\n3. Keep back flat and reach toward right foot.\n4. Hold and switch sides.',
    biomechanicsSteps: [
      'Hinge initiates at hip crease with neutral spine',
      'Front knee remains straight with flexed ankle',
      'Zero bouncing or rounding of upper back',
    ],
    tips: ['Hinge from hips', 'Do not round spine'],
    restDurationSeconds: 15,
    animationType: 'hamstring_stretch',
  },
  {
    id: 'shoulder_stretch',
    name: 'SHOULDER STRETCH',
    category: 'Upper Body Mobility',
    durationSeconds: 30,
    repetitionCount: 2,
    calories: 12,
    difficulty: 'All Levels',
    focusAreas: ['Posterior Deltoids', 'Rotator Cuff', 'Upper Back'],
    instructions: 'Bring one straight arm across chest horizontally. Use opposite arm to gently pull elbow in toward body.',
    instructionsFull: '1. Stand tall and extend right arm across chest horizontally.\n2. Hook left forearm under right elbow and gently draw arm closer.\n3. Keep right shoulder pressed down away from ear.\n4. Hold and switch sides.',
    biomechanicsSteps: [
      'Stretching arm stays straight at shoulder height',
      'Shoulder stays pressed down away from ear',
      'Torso remains square forward without twisting',
    ],
    tips: ['Keep shoulder down', 'Hold steady without force'],
    restDurationSeconds: 15,
    animationType: 'arm_circles',
  },
];

export const WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: 'pcos_metabolic_protocol',
    title: 'PCOS Insulin Balance & Strength',
    category: 'PCOS & Hormone Health',
    patientCondition: 'pcos',
    clinicalApproval: 'Endocrinologist & Nutritionist Approved',
    targetHeartRateBpm: '120 - 150 BPM (Cortisol Safe)',
    safetySafeguards: 'Low-cortisol steady resistance; enhances GLUT4 insulin uptake without adrenal exhaustion.',
    durationMinutes: 18,
    caloriesBurned: 185,
    level: 'All Levels',
    description: 'Designed for PCOS patients to enhance cellular insulin sensitivity and build lean metabolic muscle.',
    exercises: [
      EXERCISE_CATALOG[0], // Squats
      EXERCISE_CATALOG[4], // Glute Bridge
      EXERCISE_CATALOG[7], // Side Leg Raises
      EXERCISE_CATALOG[12], // Bird Dog
      EXERCISE_CATALOG[14], // Calf Raises
      EXERCISE_CATALOG[8], // Arm Circles
    ],
  },
  {
    id: 'prenatal_trimester_safe',
    title: 'Prenatal Trimester-Safe Pelvic Flow',
    category: 'Prenatal & Pregnancy',
    patientCondition: 'prenatal',
    clinicalApproval: 'OB/GYN & Pelvic Health Verified',
    targetHeartRateBpm: '110 - 135 BPM (Fetal Safe)',
    safetySafeguards: '100% Zero prone/belly-lying positions. Zero heavy crunches. Focus on pelvic floor & posture.',
    durationMinutes: 15,
    caloriesBurned: 120,
    level: 'Beginner',
    description: 'Trimester 1, 2, and 3 safe routine to relieve pelvic girdle pressure and strengthen labor muscles.',
    exercises: [
      EXERCISE_CATALOG[19], // Child's Pose
      EXERCISE_CATALOG[20], // Cat-Cow Stretch
      EXERCISE_CATALOG[7], // Side Leg Raises
      EXERCISE_CATALOG[18], // Wall Sit
      EXERCISE_CATALOG[23], // Shoulder Stretch
      EXERCISE_CATALOG[13], // Standing Knee Raises
    ],
  },
  {
    id: 'postpartum_pelvic_recovery',
    title: 'Postpartum Diastasis & Pelvic Recovery',
    category: 'Postpartum Rehabilitation',
    patientCondition: 'postpartum',
    clinicalApproval: 'Postpartum Physical Therapy Approved',
    targetHeartRateBpm: '100 - 130 BPM (Recovery Zone)',
    safetySafeguards: 'Diastasis-recti safe. Activates deep transverse abdominis without intra-abdominal bulging.',
    durationMinutes: 15,
    caloriesBurned: 130,
    level: 'Gentle',
    description: 'Rebuild core integrity, heal diastasis recti, and restore pelvic floor tone safely after childbirth.',
    exercises: [
      EXERCISE_CATALOG[4], // Glute Bridge
      EXERCISE_CATALOG[12], // Bird Dog
      EXERCISE_CATALOG[20], // Cat-Cow Stretch
      EXERCISE_CATALOG[13], // Standing Knee Raises
      EXERCISE_CATALOG[19], // Child's Pose
      EXERCISE_CATALOG[14], // Calf Raises
    ],
  },
  {
    id: 'menstrual_endo_pain_relief',
    title: 'Menstrual & Endo Pain Relief Flow',
    category: 'Menstrual & Endo Relief',
    patientCondition: 'menstrual',
    clinicalApproval: 'Gynecological Pain Board Approved',
    targetHeartRateBpm: '90 - 120 BPM (Parasympathetic Zone)',
    safetySafeguards: 'Anti-spasmodic gentle stretches to release uterine ligaments and reduce prostaglandin pain.',
    durationMinutes: 12,
    caloriesBurned: 95,
    level: 'Restorative',
    description: 'Gentle therapeutic movement to relieve pelvic cramps, lower back tightness, and endometriosis flare-ups.',
    exercises: [
      EXERCISE_CATALOG[19], // Child's Pose
      EXERCISE_CATALOG[20], // Cat-Cow Stretch
      EXERCISE_CATALOG[22], // Hamstring Stretch
      EXERCISE_CATALOG[21], // Hip Flexor Stretch
      EXERCISE_CATALOG[4], // Glute Bridge
      EXERCISE_CATALOG[23], // Shoulder Stretch
    ],
  },
  {
    id: 'menopause_bone_density',
    title: 'Menopause Bone Density & Sarcopenia',
    category: 'Menopause & Bone Strength',
    patientCondition: 'menopause',
    clinicalApproval: 'Orthopedic & Geriatric Health Approved',
    targetHeartRateBpm: '115 - 145 BPM (Osteogenic Stimulus)',
    safetySafeguards: 'Weight-bearing axial loading to stimulate osteoblast bone deposition and prevent sarcopenia.',
    durationMinutes: 18,
    caloriesBurned: 175,
    level: 'All Levels',
    description: 'Axial-loaded resistance exercises designed for perimenopause and post-menopause bone mineral density.',
    exercises: [
      EXERCISE_CATALOG[0], // Squats
      EXERCISE_CATALOG[14], // Calf Raises
      EXERCISE_CATALOG[17], // Step-ups
      EXERCISE_CATALOG[18], // Wall Sit
      EXERCISE_CATALOG[8], // Arm Circles
      EXERCISE_CATALOG[13], // Standing Knee Raises
    ],
  },
  {
    id: 'cardiometabolic_endothelial_protocol',
    title: 'Cardiometabolic Endothelial Flow',
    category: 'Cardiology & Vascular Health',
    patientCondition: 'cardio',
    clinicalApproval: 'Cardiologist & Preventive Medicine Approved',
    targetHeartRateBpm: '120 - 145 BPM (Submaximal Aerobic)',
    safetySafeguards: 'Prescribed for endothelial vasodilation and arterial elasticity; avoids valsalva breath holding.',
    durationMinutes: 16,
    caloriesBurned: 160,
    level: 'All Levels',
    description: 'Cardiologist-prescribed aerobic circuit to optimize heart rate variability and blood pressure regulation.',
    exercises: [
      EXERCISE_CATALOG[0], // Squats
      EXERCISE_CATALOG[1], // Jumping Jacks
      EXERCISE_CATALOG[2], // Forward Lunges
      EXERCISE_CATALOG[4], // Glute Bridge
      EXERCISE_CATALOG[6], // Plank
      EXERCISE_CATALOG[7], // Side Leg Raises
    ],
  },
];

// =========================================================================
// 60FPS STRICT HUMANOID SKELETAL RIG CANVAS SUPPORTING ALL 24 EXERCISES
// =========================================================================
function StrictBiomechanicalHumanCanvas({ 
  exerciseType, 
  isPaused 
}: { 
  exerciseType?: string; 
  isPaused: boolean; 
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);
  const angleRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localAngle = angleRef.current;

    const render = () => {
      if (!isPaused) {
        localAngle += 0.052; // Smooth 60 FPS cadence
        angleRef.current = localAngle;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 10;
      const theta = localAngle;

      const paintSkin = '#FDBA74';
      const paintTankTop = '#0284C7';
      const paintShorts = '#1E293B';
      const paintShoes = '#475569';
      const paintHair = '#451A03';
      const type = (exerciseType || '').toLowerCase().trim().replace(/[- ]/g, '_');

      // =========================================================================
      // 1. GLUTE BRIDGE (SUPINE ON MAT, PELVIS ELEVATION TO STRAIGHT DIAGONAL)
      // =========================================================================
      if (type.includes('glute_bridge') || type.includes('bridge')) {
        const bridgePhase = (Math.sin(theta) + 1) / 2;
        const pelvisRise = bridgePhase * 42;

        ctx.fillStyle = '#E2E8F0';
        ctx.beginPath();
        ctx.roundRect(cx - 130, cy + 85, 260, 10, 4);
        ctx.fill();

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx, cy + 90, 95, 8, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.fill();
        ctx.restore();

        const headX = cx - 85;
        const headY = cy + 62;
        ctx.fillStyle = paintHair;
        ctx.beginPath();
        ctx.arc(headX, headY, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = paintSkin;
        ctx.beginPath();
        ctx.arc(headX + 4, headY - 2, 13, 0, Math.PI * 2);
        ctx.fill();

        const shoulderX = cx - 60;
        const shoulderY = cy + 65;
        const pelvisX = cx;
        const pelvisY = cy + 65 - pelvisRise;
        const footX = cx + 70;
        const footY = cy + 85;
        const kneeX = cx + 45;
        const kneeY = cy + 25 - (pelvisRise * 0.3);

        ctx.strokeStyle = paintSkin;
        ctx.lineWidth = 7;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY + 8);
        ctx.lineTo(cx + 10, cy + 82);
        ctx.stroke();

        ctx.save();
        ctx.strokeStyle = paintTankTop;
        ctx.lineWidth = 26;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(pelvisX, pelvisY);
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = paintShorts;
        ctx.beginPath();
        ctx.ellipse(pelvisX, pelvisY, 18, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = paintSkin;
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(pelvisX, pelvisY);
        ctx.lineTo(kneeX, kneeY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(kneeX, kneeY);
        ctx.lineTo(footX, footY - 6);
        ctx.stroke();

        ctx.fillStyle = paintShoes;
        ctx.beginPath();
        ctx.roundRect(footX - 10, footY - 8, 24, 10, 3);
        ctx.fill();
      }

      // =========================================================================
      // 2. HIGH KNEES (ALTERNATING 90° HIP FLEXION & ACTIVE CONTRALATERAL ARM PUMP)
      // =========================================================================
      else if (type.includes('high_knee') || type.includes('high_knees')) {
        const isRightLead = Math.sin(theta) > 0;
        const liftMagnitude = Math.abs(Math.sin(theta));
        const bodyBounce = Math.abs(Math.sin(theta * 2)) * 6;
        const bodyY = cy - bodyBounce;

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx, cy + 122, 42, 6, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.fill();
        ctx.restore();

        const liftedKneeY = bodyY + 36 - (liftMagnitude * 32);
        const groundedFootY = cy + 114;

        const leftKneeY = isRightLead ? (bodyY + 68) : liftedKneeY;
        const leftFootY = isRightLead ? groundedFootY : (liftedKneeY + 40);
        const leftFootX = isRightLead ? (cx - 14) : (cx - 10);

        const rightKneeY = isRightLead ? liftedKneeY : (bodyY + 68);
        const rightFootY = isRightLead ? (liftedKneeY + 40) : groundedFootY;
        const rightFootX = isRightLead ? (cx + 10) : (cx + 14);

        ctx.strokeStyle = paintSkin;
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(cx - 10, bodyY + 38);
        ctx.lineTo(cx - 14, leftKneeY);
        ctx.lineTo(leftFootX, leftFootY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + 10, bodyY + 38);
        ctx.lineTo(cx + 14, rightKneeY);
        ctx.lineTo(rightFootX, rightFootY);
        ctx.stroke();

        ctx.fillStyle = paintShoes;
        ctx.beginPath();
        ctx.roundRect(leftFootX - 8, leftFootY - 4, 16, 9, 3);
        ctx.roundRect(rightFootX - 8, rightFootY - 4, 16, 9, 3);
        ctx.fill();

        ctx.fillStyle = paintShorts;
        ctx.beginPath();
        ctx.roundRect(cx - 20, bodyY, 40, 42, 6);
        ctx.fill();

        ctx.fillStyle = paintTankTop;
        ctx.beginPath();
        ctx.roundRect(cx - 18, bodyY - 48, 36, 52, 8);
        ctx.fill();

        ctx.fillStyle = paintSkin;
        ctx.fillRect(cx - 5, bodyY - 63, 10, 16);
        ctx.beginPath();
        ctx.ellipse(cx, bodyY - 76, 13, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = paintHair;
        ctx.beginPath();
        ctx.arc(cx, bodyY - 81, 14, Math.PI, Math.PI * 2);
        ctx.fill();

        const armPumpL = isRightLead ? 18 : -18;
        const armPumpR = isRightLead ? -18 : 18;

        ctx.strokeStyle = paintSkin;
        ctx.lineWidth = 7;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(cx - 18, bodyY - 38);
        ctx.lineTo(cx - 24, bodyY + 20);
        ctx.lineTo(cx - 18 + armPumpL, bodyY + 15);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + 18, bodyY - 38);
        ctx.lineTo(cx + 24, bodyY + 20);
        ctx.lineTo(cx + 18 + armPumpR, bodyY + 15);
        ctx.stroke();
      }

      // =========================================================================
      // 3. FORWARD LUNGES & STEP-UPS (ALTERNATING FORWARD LUNGE SEQUENCE)
      // =========================================================================
      else if (type.includes('lunge') || type.includes('step_up')) {
        const isRightLeg = (theta % (Math.PI * 2)) < Math.PI;
        const normalizedAngle = isRightLeg ? (theta % Math.PI) : ((theta - Math.PI) % Math.PI);
        const lungePhase = Math.sin(normalizedAngle);
        const lungeDepth = lungePhase * 40;
        const stepSpread = lungePhase * 52;

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx, cy + 124, 60, 7.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
        ctx.fill();
        ctx.restore();

        const torsoY = cy - 48 + lungeDepth;

        const frontFootX = isRightLeg ? (cx + 12 + stepSpread) : (cx - 12 - stepSpread);
        const frontFootY = cy + 114;
        const rearFootX = isRightLeg ? (cx - 16) : (cx + 16);
        const rearFootY = cy + 114;

        const frontKneeX = isRightLeg ? (cx + 12 + (stepSpread * 0.75)) : (cx - 12 - (stepSpread * 0.75));
        const frontKneeY = cy + 68 + (lungeDepth * 0.85);
        const rearKneeX = isRightLeg ? (cx - 12) : (cx + 12);
        const rearKneeY = cy + 68 + lungeDepth;

        ctx.strokeStyle = paintSkin;
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';

        const rearHipX = isRightLeg ? (cx - 10) : (cx + 10);
        ctx.beginPath();
        ctx.moveTo(rearHipX, torsoY + 38);
        ctx.lineTo(rearKneeX, rearKneeY);
        ctx.lineTo(rearFootX, rearFootY);
        ctx.stroke();

        const frontHipX = isRightLeg ? (cx + 10) : (cx - 10);
        ctx.beginPath();
        ctx.moveTo(frontHipX, torsoY + 38);
        ctx.lineTo(frontKneeX, frontKneeY);
        ctx.lineTo(frontFootX, frontFootY);
        ctx.stroke();

        ctx.fillStyle = paintShoes;
        ctx.beginPath();
        ctx.roundRect(rearFootX - 8, rearFootY - 4, 18, 9, 3);
        ctx.roundRect(frontFootX - 8, frontFootY - 4, 18, 9, 3);
        ctx.fill();

        ctx.fillStyle = paintShorts;
        ctx.beginPath();
        ctx.roundRect(cx - 20, torsoY, 40, 42, 6);
        ctx.fill();

        ctx.fillStyle = paintTankTop;
        ctx.beginPath();
        ctx.roundRect(cx - 18, torsoY - 48, 36, 52, 8);
        ctx.fill();

        ctx.fillStyle = paintSkin;
        ctx.fillRect(cx - 5, torsoY - 63, 10, 16);
        ctx.beginPath();
        ctx.ellipse(cx, torsoY - 76, 13, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = paintHair;
        ctx.beginPath();
        ctx.arc(cx, torsoY - 81, 14, Math.PI, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = paintSkin;
        ctx.lineWidth = 7;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - 18, torsoY - 38);
        ctx.lineTo(cx - 28, torsoY - 18);
        ctx.lineTo(cx - 16, torsoY - 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + 18, torsoY - 38);
        ctx.lineTo(cx + 28, torsoY - 18);
        ctx.lineTo(cx + 16, torsoY - 2);
        ctx.stroke();
      }

      // =========================================================================
      // 4. SQUATS & WALL SIT (FEET FIXED SHOULDER-WIDTH, HIPS BACK & DOWN)
      // =========================================================================
      else if (type.includes('squat') || type.includes('wall_sit')) {
        const squatPhase = (Math.sin(theta - Math.PI / 2) + 1) / 2;
        const squatDepth = squatPhase * 42;
        const torsoY = cy - 50 + squatDepth;

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx, cy + 124, 48, 7.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = paintShoes;
        ctx.beginPath();
        ctx.roundRect(cx - 26, cy + 114, 18, 9, 3);
        ctx.roundRect(cx + 8, cy + 114, 18, 9, 3);
        ctx.fill();
        ctx.fillStyle = '#CBD5E1';
        ctx.fillRect(cx - 26, cy + 121, 18, 2);
        ctx.fillRect(cx + 8, cy + 121, 18, 2);

        const kneeLX = cx - 20 - (squatPhase * 10);
        const kneeLY = cy + 56 + (squatPhase * 20);
        const kneeRX = cx + 20 + (squatPhase * 10);
        const kneeRY = cy + 56 + (squatPhase * 20);

        ctx.strokeStyle = paintSkin;
        ctx.lineWidth = 13;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(cx - 14, torsoY + 38);
        ctx.lineTo(kneeLX, kneeLY);
        ctx.lineTo(cx - 17, cy + 114);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + 14, torsoY + 38);
        ctx.lineTo(kneeRX, kneeRY);
        ctx.lineTo(cx + 17, cy + 114);
        ctx.stroke();

        ctx.fillStyle = paintShorts;
        ctx.beginPath();
        ctx.roundRect(cx - 22, torsoY, 44, 42, 6);
        ctx.fill();

        ctx.fillStyle = paintTankTop;
        ctx.beginPath();
        ctx.roundRect(cx - 19, torsoY - 48, 38, 52, 8);
        ctx.fill();

        ctx.fillStyle = paintSkin;
        ctx.fillRect(cx - 5, torsoY - 63, 10, 16);
        ctx.beginPath();
        ctx.ellipse(cx, torsoY - 76, 13, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = paintHair;
        ctx.beginPath();
        ctx.arc(cx, torsoY - 81, 14, Math.PI, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = paintSkin;
        ctx.lineWidth = 7.5;
        ctx.lineCap = 'round';
        const armReachX = cx;
        const armReachY = torsoY - 24 - (squatPhase * 8);

        ctx.beginPath();
        ctx.moveTo(cx - 18, torsoY - 38);
        ctx.lineTo(armReachX - 4, armReachY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + 18, torsoY - 38);
        ctx.lineTo(armReachX + 4, armReachY);
        ctx.stroke();
      }

      // =========================================================================
      // 5. JUMPING JACKS (EXACT 5-STAGE BIOMECHANICAL AIRBORNE JUMP)
      // =========================================================================
      else if (type.includes('jumping_jack') || type.includes('jumping_jacks')) {
        const phase = (Math.sin(theta - Math.PI / 2) + 1) / 2;
        const jumpElevation = Math.sin(phase * Math.PI) * 14;
        const legSpread = phase * 40;
        const armAngle = phase * (Math.PI * 0.92);

        const shadowScale = Math.max(0.4, 1 - (jumpElevation / 20));
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx, cy + 120, 45 * shadowScale, 8 * shadowScale, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
        ctx.fill();
        ctx.restore();

        const bodyY = cy - jumpElevation;

        ctx.fillStyle = paintShoes;
        ctx.beginPath();
        ctx.roundRect(cx - 16 - legSpread, bodyY + 112, 16, 9, 3);
        ctx.roundRect(cx + legSpread, bodyY + 112, 16, 9, 3);
        ctx.fill();

        ctx.strokeStyle = paintSkin;
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(cx - 10, bodyY + 40);
        ctx.lineTo(cx - 8 - legSpread, bodyY + 116);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + 10, bodyY + 40);
        ctx.lineTo(cx + 8 + legSpread, bodyY + 116);
        ctx.stroke();

        ctx.fillStyle = paintShorts;
        ctx.beginPath();
        ctx.roundRect(cx - 22, bodyY, 44, 44, 6);
        ctx.fill();

        ctx.fillStyle = paintTankTop;
        ctx.beginPath();
        ctx.roundRect(cx - 19, bodyY - 48, 38, 54, 8);
        ctx.fill();

        ctx.fillStyle = paintSkin;
        ctx.fillRect(cx - 5, bodyY - 63, 10, 16);
        ctx.beginPath();
        ctx.ellipse(cx, bodyY - 76, 13, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = paintHair;
        ctx.beginPath();
        ctx.arc(cx, bodyY - 81, 14, Math.PI, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = paintSkin;
        ctx.lineWidth = 7.5;
        ctx.lineCap = 'round';

        const shoulderLX = cx - 18;
        const shoulderLY = bodyY - 42;
        const armLength = 72;

        const radL = (Math.PI * 0.5) - armAngle;
        const handLX = shoulderLX - (Math.sin(radL) * armLength * 0.2) - (Math.cos(radL) * armLength);
        const handLY = shoulderLY + (Math.sin(radL) * armLength);

        ctx.beginPath();
        ctx.moveTo(shoulderLX, shoulderLY);
        ctx.lineTo(handLX, handLY);
        ctx.stroke();

        const shoulderRX = cx + 18;
        const shoulderRY = bodyY - 42;
        const radR = (Math.PI * 0.5) - armAngle;
        const handRX = shoulderRX + (Math.sin(radR) * armLength * 0.2) + (Math.cos(radR) * armLength);
        const handRY = shoulderRY + (Math.sin(radR) * armLength);

        ctx.beginPath();
        ctx.moveTo(shoulderRX, shoulderRY);
        ctx.lineTo(handRX, handRY);
        ctx.stroke();
      }

      // =========================================================================
      // 6. FOREARM PLANK (STRICT STATIC ISOMETRIC HOLD WITH DIAPHRAGMATIC BREATH)
      // =========================================================================
      else if (type === 'plank' || type.includes('plank_hold')) {
        const breath = Math.sin(theta * 1.2) * 1.2;

        ctx.fillStyle = '#E2E8F0';
        ctx.beginPath();
        ctx.roundRect(cx - 130, cy + 70, 260, 8, 3);
        ctx.fill();

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx + 10, cy + 75, 105, 8, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
        ctx.fill();
        ctx.restore();

        const headX = cx - 80;
        const headY = cy + 22 + (breath * 0.4);
        const nearShoulderX = cx - 48;
        const nearShoulderY = cy + 28 + breath;
        const farShoulderX = cx - 42;
        const farShoulderY = cy + 24 + breath;

        const nearHipX = cx + 8;
        const nearHipY = cy + 38;
        const farHipX = cx + 14;
        const farHipY = cy + 34;

        const nearKneeX = cx + 52;
        const nearKneeY = cy + 49;
        const farKneeX = cx + 58;
        const farKneeY = cy + 45;

        const nearFootX = cx + 90;
        const nearFootY = cy + 62;
        const farFootX = cx + 96;
        const farFootY = cy + 58;

        const nearElbowX = nearShoulderX;
        const nearElbowY = cy + 68;
        const nearWristX = cx - 20;
        const nearWristY = cy + 68;

        const farElbowX = farShoulderX;
        const farElbowY = cy + 65;
        const farWristX = cx - 14;
        const farWristY = cy + 65;

        ctx.strokeStyle = '#F97316';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(farHipX, farHipY);
        ctx.lineTo(farKneeX, farKneeY);
        ctx.lineTo(farFootX, farFootY);
        ctx.stroke();

        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.roundRect(farFootX - 4, farFootY - 2, 14, 8, 2);
        ctx.fill();

        ctx.strokeStyle = '#F97316';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(farShoulderX, farShoulderY);
        ctx.lineTo(farElbowX, farElbowY);
        ctx.lineTo(farWristX, farWristY);
        ctx.stroke();

        const torsoGrad = ctx.createLinearGradient(nearShoulderX, nearShoulderY - 10, nearHipX, nearHipY + 10);
        torsoGrad.addColorStop(0, '#0284C7');
        torsoGrad.addColorStop(1, '#0369A1');
        ctx.strokeStyle = torsoGrad;
        ctx.lineWidth = 26;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(nearShoulderX + 4, nearShoulderY);
        ctx.lineTo(nearHipX - 2, nearHipY);
        ctx.stroke();

        ctx.fillStyle = '#1E293B';
        ctx.beginPath();
        ctx.roundRect(nearHipX - 16, nearHipY - 14, 38, 28, 6);
        ctx.fill();

        ctx.fillStyle = '#FDBA74';
        ctx.beginPath();
        ctx.roundRect(headX + 8, headY + 4, 12, 10, 2);
        ctx.fill();

        ctx.fillStyle = '#451A03';
        ctx.beginPath();
        ctx.arc(headX, headY, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(headX - 12, headY - 4, 10, 6, -0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FDBA74';
        ctx.beginPath();
        ctx.arc(headX + 4, headY + 2, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#FDBA74';
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(nearHipX, nearHipY);
        ctx.lineTo(nearKneeX, nearKneeY);
        ctx.lineTo(nearFootX, nearFootY);
        ctx.stroke();

        ctx.fillStyle = '#FB923C';
        ctx.beginPath();
        ctx.arc(nearKneeX, nearKneeY, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.roundRect(nearFootX - 4, nearFootY - 2, 16, 8, 2);
        ctx.fill();
        ctx.fillStyle = '#E2E8F0';
        ctx.fillRect(nearFootX - 4, nearFootY + 4, 16, 2);

        ctx.fillStyle = '#0284C7';
        ctx.beginPath();
        ctx.arc(nearShoulderX, nearShoulderY, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#FDBA74';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(nearShoulderX, nearShoulderY);
        ctx.lineTo(nearElbowX, nearElbowY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(nearElbowX, nearElbowY);
        ctx.lineTo(nearWristX, nearWristY);
        ctx.stroke();

        ctx.fillStyle = '#FB923C';
        ctx.beginPath();
        ctx.arc(nearWristX, nearWristY, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // =========================================================================
      // 7. PUSH-UPS & MOUNTAIN CLIMBERS (REALISTIC 3/4 HUMANOID PUSH-UP)
      // =========================================================================
      else if (type.includes('push_up') || type.includes('mountain_climber')) {
        const pushPhase = (Math.sin(theta - Math.PI / 2) + 1) / 2;
        const chestDescent = pushPhase * 36;

        ctx.fillStyle = '#E2E8F0';
        ctx.beginPath();
        ctx.roundRect(cx - 130, cy + 70, 260, 8, 3);
        ctx.fill();

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx + 10, cy + 75, 105, 8, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
        ctx.fill();
        ctx.restore();

        const nearHandX = cx - 36;
        const nearHandY = cy + 68;
        const farHandX = cx - 30;
        const farHandY = cy + 65;

        const nearFootX = cx + 90;
        const nearFootY = cy + 62;
        const farFootX = cx + 96;
        const farFootY = cy + 58;

        const nearShoulderX = cx - 48;
        const nearShoulderY = cy + 14 + chestDescent;
        const farShoulderX = cx - 42;
        const farShoulderY = cy + 10 + chestDescent;

        const headX = cx - 80;
        const headY = nearShoulderY - 6;
        const nearHipX = cx + 8;
        const nearHipY = cy + 28 + (chestDescent * 0.65);
        const farHipX = cx + 14;
        const farHipY = cy + 24 + (chestDescent * 0.65);
        const nearKneeX = cx + 52;
        const nearKneeY = cy + 44 + (chestDescent * 0.35);
        const farKneeX = cx + 58;
        const farKneeY = cy + 40 + (chestDescent * 0.35);

        const nearElbowX = cx - 58 - (pushPhase * 6);
        const nearElbowY = nearShoulderY + 16 + (pushPhase * 14);
        const farElbowX = cx - 52 - (pushPhase * 6);
        const farElbowY = farShoulderY + 16 + (pushPhase * 14);

        ctx.strokeStyle = '#F97316';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(farHipX, farHipY);
        ctx.lineTo(farKneeX, farKneeY);
        ctx.lineTo(farFootX, farFootY);
        ctx.stroke();

        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.roundRect(farFootX - 4, farFootY - 2, 14, 8, 2);
        ctx.fill();

        ctx.strokeStyle = '#F97316';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(farShoulderX, farShoulderY);
        ctx.lineTo(farElbowX, farElbowY);
        ctx.lineTo(farHandX, farHandY);
        ctx.stroke();

        const torsoGrad = ctx.createLinearGradient(nearShoulderX, nearShoulderY - 10, nearHipX, nearHipY + 10);
        torsoGrad.addColorStop(0, '#0284C7');
        torsoGrad.addColorStop(1, '#0369A1');
        ctx.strokeStyle = torsoGrad;
        ctx.lineWidth = 26;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(nearShoulderX + 4, nearShoulderY);
        ctx.lineTo(nearHipX - 2, nearHipY);
        ctx.stroke();

        ctx.fillStyle = '#1E293B';
        ctx.beginPath();
        ctx.roundRect(nearHipX - 16, nearHipY - 14, 38, 28, 6);
        ctx.fill();

        ctx.fillStyle = '#FDBA74';
        ctx.beginPath();
        ctx.roundRect(headX + 8, headY + 4, 12, 10, 2);
        ctx.fill();

        ctx.fillStyle = '#451A03';
        ctx.beginPath();
        ctx.arc(headX, headY, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(headX - 12, headY - 4, 10, 6, -0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FDBA74';
        ctx.beginPath();
        ctx.arc(headX + 4, headY + 2, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#FDBA74';
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(nearHipX, nearHipY);
        ctx.lineTo(nearKneeX, nearKneeY);
        ctx.lineTo(nearFootX, nearFootY);
        ctx.stroke();

        ctx.fillStyle = '#FB923C';
        ctx.beginPath();
        ctx.arc(nearKneeX, nearKneeY, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.roundRect(nearFootX - 4, nearFootY - 2, 16, 8, 2);
        ctx.fill();
        ctx.fillStyle = '#E2E8F0';
        ctx.fillRect(nearFootX - 4, nearFootY + 4, 16, 2);

        ctx.fillStyle = '#0284C7';
        ctx.beginPath();
        ctx.arc(nearShoulderX, nearShoulderY, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#FDBA74';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(nearShoulderX, nearShoulderY);
        ctx.lineTo(nearElbowX, nearElbowY);
        ctx.lineTo(nearHandX, nearHandY);
        ctx.stroke();

        ctx.fillStyle = '#FB923C';
        ctx.beginPath();
        ctx.roundRect(nearHandX - 6, nearHandY - 2, 12, 6, 2);
        ctx.fill();
      }

      // =========================================================================
      // 8. SIDE LEG RAISES (STRICT LATERAL ABDUCTION)
      // =========================================================================
      else if (type.includes('side_leg') || type.includes('leg_raise')) {
        const raisePhase = (Math.sin(theta - Math.PI / 2) + 1) / 2;
        const abductionAngle = raisePhase * 0.72;
        const legLength = 76;

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx, cy + 124, 46, 7, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
        ctx.fill();
        ctx.restore();

        const torsoY = cy - 48;
        const plantFootX = cx - 14;
        const plantFootY = cy + 114;

        const activeHipX = cx + 12;
        const activeHipY = torsoY + 38;
        const activeFootX = activeHipX + Math.sin(abductionAngle) * legLength;
        const activeFootY = activeHipY + Math.cos(abductionAngle) * legLength;
        const activeKneeX = activeHipX + Math.sin(abductionAngle) * (legLength * 0.5);
        const activeKneeY = activeHipY + Math.cos(abductionAngle) * (legLength * 0.5);

        ctx.strokeStyle = paintSkin;
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(cx - 10, torsoY + 38);
        ctx.lineTo(plantFootX, plantFootY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(activeHipX, activeHipY);
        ctx.lineTo(activeKneeX, activeKneeY);
        ctx.lineTo(activeFootX, activeFootY);
        ctx.stroke();

        ctx.fillStyle = paintShoes;
        ctx.beginPath();
        ctx.roundRect(plantFootX - 8, plantFootY - 2, 18, 9, 3);
        ctx.fill();

        ctx.save();
        ctx.translate(activeFootX, activeFootY);
        ctx.rotate(-abductionAngle);
        ctx.beginPath();
        ctx.roundRect(-6, -4, 18, 9, 3);
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = paintShorts;
        ctx.beginPath();
        ctx.roundRect(cx - 20, torsoY, 40, 42, 6);
        ctx.fill();

        ctx.fillStyle = paintTankTop;
        ctx.beginPath();
        ctx.roundRect(cx - 18, torsoY - 48, 36, 52, 8);
        ctx.fill();

        ctx.fillStyle = paintSkin;
        ctx.fillRect(cx - 5, torsoY - 63, 10, 16);
        ctx.beginPath();
        ctx.ellipse(cx, torsoY - 76, 13, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = paintHair;
        ctx.beginPath();
        ctx.arc(cx, torsoY - 81, 14, Math.PI, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = paintSkin;
        ctx.lineWidth = 7;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - 18, torsoY - 38);
        ctx.lineTo(cx - 28, torsoY - 18);
        ctx.lineTo(cx - 16, torsoY - 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + 18, torsoY - 38);
        ctx.lineTo(cx + 28, torsoY - 18);
        ctx.lineTo(cx + 16, torsoY - 2);
        ctx.stroke();
      }

      // =========================================================================
      // 9. BIRD DOG (CONTRALATERAL REACH ON ALL FOURS)
      // =========================================================================
      else if (type.includes('bird_dog')) {
        const extPhase = (Math.sin(theta - Math.PI / 2) + 1) / 2;
        
        ctx.fillStyle = '#E2E8F0';
        ctx.beginPath();
        ctx.roundRect(cx - 130, cy + 70, 260, 8, 3);
        ctx.fill();

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx, cy + 75, 100, 7, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.fill();
        ctx.restore();

        const shoulderX = cx - 35;
        const shoulderY = cy + 32;
        const hipX = cx + 25;
        const hipY = cy + 32;

        const handX = shoulderX - 25 - (extPhase * 40);
        const handY = (cy + 68) - (extPhase * 36);
        const footX = hipX + 25 + (extPhase * 42);
        const footY = (cy + 68) - (extPhase * 36);
        const kneeX = hipX + 12 + (extPhase * 20);
        const kneeY = (cy + 68) - (extPhase * 18);

        const plantHandX = shoulderX;
        const plantHandY = cy + 68;
        const plantKneeX = hipX - 5;
        const plantKneeY = cy + 68;

        ctx.strokeStyle = '#F97316';
        ctx.lineWidth = 7;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(shoulderX + 6, shoulderY);
        ctx.lineTo(plantHandX + 6, plantHandY);
        ctx.stroke();

        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(hipX - 5, hipY);
        ctx.lineTo(plantKneeX, plantKneeY);
        ctx.stroke();

        ctx.strokeStyle = '#FDBA74';
        ctx.lineWidth = 11;
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(kneeX, kneeY);
        ctx.lineTo(footX, footY);
        ctx.stroke();

        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.roundRect(footX - 4, footY - 4, 14, 8, 2);
        ctx.fill();

        ctx.strokeStyle = '#0284C7';
        ctx.lineWidth = 24;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(hipX, hipY);
        ctx.stroke();

        ctx.fillStyle = '#1E293B';
        ctx.beginPath();
        ctx.roundRect(hipX - 14, hipY - 12, 28, 24, 4);
        ctx.fill();

        ctx.fillStyle = '#451A03';
        ctx.beginPath();
        ctx.arc(shoulderX - 22, shoulderY - 4, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FDBA74';
        ctx.beginPath();
        ctx.arc(shoulderX - 18, shoulderY - 2, 11, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#FDBA74';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(handX, handY);
        ctx.stroke();
      }

      // =========================================================================
      // 10. CALF RAISES (PLANTARFLEXION ON TOES)
      // =========================================================================
      else if (type.includes('calf')) {
        const calfPhase = (Math.sin(theta - Math.PI / 2) + 1) / 2;
        const heelElevation = calfPhase * 24;
        const bodyY = cy - heelElevation;

        const shadowWidth = 50 - (calfPhase * 16);
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx, cy + 124, shadowWidth, 6, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.fillStyle = paintShoes;
        ctx.translate(cx - 16, bodyY + 114);
        ctx.rotate(-calfPhase * 0.35);
        ctx.beginPath();
        ctx.roundRect(-4, -2, 18, 9, 3);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.fillStyle = paintShoes;
        ctx.translate(cx + 8, bodyY + 114);
        ctx.rotate(calfPhase * 0.35);
        ctx.beginPath();
        ctx.roundRect(-4, -2, 18, 9, 3);
        ctx.fill();
        ctx.restore();

        ctx.strokeStyle = paintSkin;
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(cx - 10, bodyY + 38);
        ctx.lineTo(cx - 10, bodyY + 112);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + 10, bodyY + 38);
        ctx.lineTo(cx + 10, bodyY + 112);
        ctx.stroke();

        ctx.fillStyle = '#FB923C';
        ctx.beginPath();
        ctx.ellipse(cx - 14, bodyY + 84, 5, 10, 0, 0, Math.PI * 2);
        ctx.ellipse(cx + 14, bodyY + 84, 5, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = paintShorts;
        ctx.beginPath();
        ctx.roundRect(cx - 22, bodyY, 44, 42, 6);
        ctx.fill();

        ctx.fillStyle = paintTankTop;
        ctx.beginPath();
        ctx.roundRect(cx - 19, bodyY - 48, 38, 52, 8);
        ctx.fill();

        ctx.fillStyle = paintSkin;
        ctx.fillRect(cx - 5, bodyY - 63, 10, 16);
        ctx.beginPath();
        ctx.ellipse(cx, bodyY - 76, 13, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = paintHair;
        ctx.beginPath();
        ctx.arc(cx, bodyY - 81, 14, Math.PI, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = paintSkin;
        ctx.lineWidth = 7;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - 18, bodyY - 38);
        ctx.lineTo(cx - 28, bodyY - 18);
        ctx.lineTo(cx - 16, bodyY - 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + 18, bodyY - 38);
        ctx.lineTo(cx + 28, bodyY - 18);
        ctx.lineTo(cx + 16, bodyY - 2);
        ctx.stroke();
      }

      // =========================================================================
      // 11. STANDING KNEE RAISES & BUTT KICKS
      // =========================================================================
      else if (type.includes('standing_knee') || type.includes('knee_raise') || type.includes('butt_kick')) {
        const isButtKick = type.includes('butt_kick');
        const isRight = Math.sin(theta) > 0;
        const p = Math.abs(Math.sin(theta));

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx, cy + 122, 45, 6, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.45)';
        ctx.fill();
        ctx.restore();

        const torsoY = cy - 48;
        ctx.strokeStyle = paintSkin;
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';

        if (isButtKick) {
          const heelFold = p * 45;
          const leftFootY = isRight ? (cy + 114) : (cy + 114 - heelFold);
          const leftFootX = isRight ? (cx - 12) : (cx - 22);
          const rightFootY = isRight ? (cy + 114 - heelFold) : (cy + 114);
          const rightFootX = isRight ? (cx + 22) : (cx + 12);

          ctx.beginPath();
          ctx.moveTo(cx - 10, torsoY + 38);
          ctx.lineTo(cx - 12, cy + 70);
          ctx.lineTo(leftFootX, leftFootY);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(cx + 10, torsoY + 38);
          ctx.lineTo(cx + 12, cy + 70);
          ctx.lineTo(rightFootX, rightFootY);
          ctx.stroke();

          ctx.fillStyle = paintShoes;
          ctx.beginPath();
          ctx.roundRect(leftFootX - 6, leftFootY - 4, 16, 8, 2);
          ctx.roundRect(rightFootX - 6, rightFootY - 4, 16, 8, 2);
          ctx.fill();
        } else {
          const kneeDrive = p * 40;
          const leftKneeY = isRight ? (cy + 68) : (cy + 68 - kneeDrive);
          const leftFootY = isRight ? (cy + 114) : (leftKneeY + 38);
          const rightKneeY = isRight ? (cy + 68 - kneeDrive) : (cy + 68);
          const rightFootY = isRight ? (rightKneeY + 38) : (cy + 114);

          ctx.beginPath();
          ctx.moveTo(cx - 10, torsoY + 38);
          ctx.lineTo(cx - 14, leftKneeY);
          ctx.lineTo(cx - 12, leftFootY);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(cx + 10, torsoY + 38);
          ctx.lineTo(cx + 14, rightKneeY);
          ctx.lineTo(cx + 12, rightFootY);
          ctx.stroke();

          ctx.fillStyle = paintShoes;
          ctx.beginPath();
          ctx.roundRect(cx - 18, leftFootY - 4, 16, 8, 2);
          ctx.roundRect(cx + 4, rightFootY - 4, 16, 8, 2);
          ctx.fill();
        }

        ctx.fillStyle = paintShorts;
        ctx.beginPath();
        ctx.roundRect(cx - 20, torsoY, 40, 42, 6);
        ctx.fill();

        ctx.fillStyle = paintTankTop;
        ctx.beginPath();
        ctx.roundRect(cx - 18, torsoY - 48, 36, 52, 8);
        ctx.fill();

        ctx.fillStyle = paintSkin;
        ctx.fillRect(cx - 5, torsoY - 63, 10, 16);
        ctx.beginPath();
        ctx.ellipse(cx, torsoY - 76, 13, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = paintHair;
        ctx.beginPath();
        ctx.arc(cx, torsoY - 81, 14, Math.PI, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = paintSkin;
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(cx - 18, torsoY - 38);
        ctx.lineTo(cx - 24, torsoY - 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + 18, torsoY - 38);
        ctx.lineTo(cx + 24, torsoY - 10);
        ctx.stroke();
      }

      // =========================================================================
      // 12. BICYCLE CRUNCHES, CRUNCHES & RUSSIAN TWISTS
      // =========================================================================
      else if (type.includes('crunch') || type.includes('twist') || type.includes('bicycle')) {
        const crunchPhase = Math.sin(theta); 

        ctx.fillStyle = '#E2E8F0';
        ctx.beginPath();
        ctx.roundRect(cx - 130, cy + 80, 260, 8, 3);
        ctx.fill();

        const shoulderX = cx - 40;
        const shoulderY = cy + 42 + Math.abs(crunchPhase) * 6;
        const hipX = cx;
        const hipY = cy + 62;

        ctx.strokeStyle = paintTankTop;
        ctx.lineWidth = 24;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(hipX, hipY);
        ctx.stroke();

        ctx.fillStyle = paintShorts;
        ctx.beginPath();
        ctx.ellipse(hipX, hipY, 18, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        const leg1KneeX = cx + 25 + (crunchPhase * 15);
        const leg1KneeY = cy + 35;
        const leg1FootX = cx + 60 + (crunchPhase * 25);
        const leg1FootY = cy + 45;

        ctx.strokeStyle = paintSkin;
        ctx.lineWidth = 11;
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(leg1KneeX, leg1KneeY);
        ctx.lineTo(leg1FootX, leg1FootY);
        ctx.stroke();

        ctx.fillStyle = paintShoes;
        ctx.beginPath();
        ctx.roundRect(leg1FootX - 4, leg1FootY - 4, 16, 8, 2);
        ctx.fill();

        ctx.fillStyle = paintHair;
        ctx.beginPath();
        ctx.arc(shoulderX - 18, shoulderY - 8, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = paintSkin;
        ctx.beginPath();
        ctx.arc(shoulderX - 14, shoulderY - 6, 12, 0, Math.PI * 2);
        ctx.fill();
      }

      // =========================================================================
      // 13. CHILD'S POSE & CAT-COW
      // =========================================================================
      else if (type.includes('child') || type.includes('cat') || type.includes('cow')) {
        const isCatCow = type.includes('cat') || type.includes('cow');
        const cowPhase = Math.sin(theta);
        const spineCurve = isCatCow ? (cowPhase * 10) : 0;

        ctx.fillStyle = '#E2E8F0';
        ctx.beginPath();
        ctx.roundRect(cx - 130, cy + 70, 260, 8, 3);
        ctx.fill();

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx, cy + 75, 100, 7, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.fill();
        ctx.restore();

        if (isCatCow) {
          const shoulderX = cx - 35;
          const shoulderY = cy + 32;
          const hipX = cx + 25;
          const hipY = cy + 32;

          ctx.strokeStyle = '#FDBA74';
          ctx.lineWidth = 9;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.lineTo(shoulderX, cy + 68);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(hipX, hipY);
          ctx.lineTo(hipX, cy + 68);
          ctx.stroke();

          ctx.strokeStyle = '#0284C7';
          ctx.lineWidth = 22;
          ctx.beginPath();
          ctx.moveTo(shoulderX, shoulderY);
          ctx.quadraticCurveTo(cx - 5, cy + 32 + spineCurve, hipX, hipY);
          ctx.stroke();

          const headY = cy + 24 - (spineCurve * 0.6);
          ctx.fillStyle = '#451A03';
          ctx.beginPath();
          ctx.arc(shoulderX - 20, headY, 13, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FDBA74';
          ctx.beginPath();
          ctx.arc(shoulderX - 16, headY + 2, 11, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#1E293B';
          ctx.beginPath();
          ctx.ellipse(cx + 35, cy + 56, 22, 16, 0.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#0284C7';
          ctx.lineWidth = 22;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(cx + 30, cy + 52);
          ctx.lineTo(cx - 25, cy + 62);
          ctx.stroke();

          ctx.strokeStyle = '#FDBA74';
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(cx - 25, cy + 62);
          ctx.lineTo(cx - 85, cy + 68);
          ctx.stroke();

          ctx.fillStyle = '#451A03';
          ctx.beginPath();
          ctx.arc(cx - 42, cy + 56, 12, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // =========================================================================
      // 14. STRETCHES (HAMSTRING, HIP FLEXOR, SHOULDER)
      // =========================================================================
      else if (type.includes('stretch')) {
        const stretchPhase = Math.sin(theta * 0.8);

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx, cy + 122, 55, 6, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.fill();
        ctx.restore();

        const torsoY = cy - 44;

        ctx.strokeStyle = paintSkin;
        ctx.lineWidth = 12;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(cx - 10, torsoY + 38);
        ctx.lineTo(cx - 12, cy + 114);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + 10, torsoY + 38);
        ctx.lineTo(cx + 16 + (stretchPhase * 6), cy + 114);
        ctx.stroke();

        ctx.fillStyle = paintShoes;
        ctx.beginPath();
        ctx.roundRect(cx - 20, cy + 112, 18, 9, 3);
        ctx.roundRect(cx + 8 + (stretchPhase * 6), cy + 112, 18, 9, 3);
        ctx.fill();

        ctx.fillStyle = paintShorts;
        ctx.beginPath();
        ctx.roundRect(cx - 20, torsoY, 40, 42, 6);
        ctx.fill();

        ctx.fillStyle = paintTankTop;
        ctx.beginPath();
        ctx.roundRect(cx - 18, torsoY - 48, 36, 52, 8);
        ctx.fill();

        ctx.fillStyle = paintSkin;
        ctx.fillRect(cx - 5, torsoY - 63, 10, 16);
        ctx.beginPath();
        ctx.ellipse(cx, torsoY - 76, 13, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = paintHair;
        ctx.beginPath();
        ctx.arc(cx, torsoY - 81, 14, Math.PI, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = paintSkin;
        ctx.lineWidth = 7.5;
        ctx.beginPath();
        ctx.moveTo(cx - 18, torsoY - 38);
        ctx.lineTo(cx + 18, torsoY - 32);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + 18, torsoY - 38);
        ctx.lineTo(cx + 4, torsoY - 26);
        ctx.stroke();
      }

      // =========================================================================
      // 15. ARM CIRCLES & DEFAULT (360° GLENOHUMERAL ROTATION)
      // =========================================================================
      else {
        const armLength = 76;
        const circleRadiusY = 16;
        const circleRadiusZ = 8;

        const rotCos = Math.cos(theta);
        const rotSin = Math.sin(theta);

        const leftHandOffsetY = rotSin * circleRadiusY;
        const leftHandOffsetZ = rotCos * circleRadiusZ;

        const rightHandOffsetY = rotSin * circleRadiusY;
        const rightHandOffsetZ = -rotCos * circleRadiusZ;

        const shoulderLY = cy - 42;
        const shoulderLX = cx - 18;
        const shoulderRY = cy - 42;
        const shoulderRX = cx + 18;

        const handLX = shoulderLX - armLength + leftHandOffsetZ;
        const handLY = shoulderLY + 6 + leftHandOffsetY;

        const handRX = shoulderRX + armLength + rightHandOffsetZ;
        const handRY = shoulderRY + 6 + rightHandOffsetY;

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cx, cy + 128, 44, 7, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 4;
        ctx.setLineDash([10, 5]);
        ctx.beginPath();
        ctx.ellipse(shoulderLX - armLength, shoulderLY + 6, 12, 22, 0.1, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#38BDF8';
        ctx.beginPath();
        ctx.ellipse(shoulderRX + armLength, shoulderRY + 6, 12, 22, -0.1, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = paintShoes;
        ctx.beginPath();
        ctx.roundRect(cx - 24, cy + 116, 16, 9, 3);
        ctx.roundRect(cx + 8, cy + 116, 16, 9, 3);
        ctx.fill();

        ctx.fillStyle = paintSkin;
        ctx.beginPath();
        ctx.moveTo(cx - 20, cy + 38);
        ctx.lineTo(cx - 18, cy + 116);
        ctx.lineTo(cx - 8, cy + 116);
        ctx.lineTo(cx - 6, cy + 38);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(cx + 6, cy + 38);
        ctx.lineTo(cx + 8, cy + 116);
        ctx.lineTo(cx + 18, cy + 116);
        ctx.lineTo(cx + 20, cy + 38);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = paintShorts;
        ctx.beginPath();
        ctx.roundRect(cx - 22, cy, 44, 44, 6);
        ctx.fill();

        ctx.fillStyle = paintTankTop;
        ctx.beginPath();
        ctx.roundRect(cx - 19, cy - 48, 38, 54, 8);
        ctx.fill();

        ctx.fillStyle = paintSkin;
        ctx.fillRect(cx - 5, cy - 63, 10, 16);
        ctx.beginPath();
        ctx.ellipse(cx, cy - 76, 13, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = paintHair;
        ctx.beginPath();
        ctx.arc(cx, cy - 81, 14, Math.PI, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.strokeStyle = paintSkin;
        ctx.lineWidth = 7.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(shoulderLX, shoulderLY);
        ctx.lineTo(handLX, handLY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(shoulderRX, shoulderRY);
        ctx.lineTo(handRX, handRY);
        ctx.stroke();
        ctx.restore();
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [exerciseType, isPaused]);

  return (
    <div className="relative w-full h-72 bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] rounded-3xl flex items-center justify-center overflow-hidden border border-[#E2E8F0] shadow-inner select-none">
      <canvas 
        ref={canvasRef} 
        width={340} 
        height={300} 
        className="w-full h-full object-contain"
      />
    </div>
  );
}

export interface FitnessTrackerProps {
  prescribedOnly?: boolean;
  userStage?: string;
  consultationAdvice?: Array<{
    id: string | number;
    doctor_name?: string;
    specialization?: string;
    hospital_clinic?: string;
    diagnosis: string;
    advice: string;
    created_at: string;
  }>;
}

export default function FitnessTracker({
  prescribedOnly = true,
  userStage = '',
  consultationAdvice = []
}: FitnessTrackerProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDay, setSelectedDay] = useState(25);
  const [weeklyGoal, setWeeklyGoal] = useState({ completed: 3, target: 4 });

  // Auto-detect stage to highlight doctor prescribed exercise protocol
  useEffect(() => {
    if (!userStage) return;
    const stage = userStage.toUpperCase();
    if (stage.includes('PREGNAN') || stage.includes('TRIMESTER')) {
      setSelectedCategory('prenatal');
    } else if (stage.includes('POSTPARTUM')) {
      setSelectedCategory('postpartum');
    } else if (stage.includes('MENOPAUSE') || stage.includes('PERIMENOPAUSE')) {
      setSelectedCategory('menopause');
    } else if (stage.includes('ADOLESCENT') || stage.includes('PUBERTY')) {
      setSelectedCategory('menstrual');
    }
  }, [userStage]);

  const calorieBudget = 2000;
  const [foodCalories] = useState(1340);
  const [burnedCalories, setBurnedCalories] = useState(420);
  const remainingCalories = calorieBudget - foodCalories + burnedCalories;

  const [steps] = useState(8420);
  const [waterGlasses, setWaterGlasses] = useState(9);

  // Active Workout Player State
  const [activeWorkout, setActiveWorkout] = useState<WorkoutPlan | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [playerPhase, setPlayerPhase] = useState<'ready' | 'active' | 'rest' | 'guide' | 'completed'>('ready');
  const [guideTab, setGuideTab] = useState<'video' | 'muscle' | 'how_to_do'>('video');
  const [customDuration, setCustomDuration] = useState(30);
  const [readyCountdown, setReadyCountdown] = useState(10);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [restSeconds, setRestSeconds] = useState(15);
  const [currentRep, setCurrentRep] = useState(1);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const currentExercise = activeWorkout?.exercises[currentExerciseIndex] || EXERCISE_CATALOG[0];

  // Sound Synthesizer
  const playSound = (freq = 600, duration = 0.12) => {
    if (isAudioMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Handled
    }
  };

  useEffect(() => {
    let interval: any = null;

    if (activeWorkout && isTimerRunning) {
      interval = setInterval(() => {
        if (playerPhase === 'ready') {
          setReadyCountdown((prev) => {
            if (prev <= 4 && prev > 1) {
              playSound(440, 0.08);
            } else if (prev <= 1) {
              playSound(880, 0.25);
              setPlayerPhase('active');
              setTimerSeconds(activeWorkout.exercises[currentExerciseIndex]?.durationSeconds || 30);
              setCurrentRep(1);
              return 10;
            }
            return prev - 1;
          });
        } else if (playerPhase === 'active') {
          setTimerSeconds((prev) => {
            if (prev <= 4 && prev > 1) {
              playSound(520, 0.08);
            } else if (prev <= 1) {
              playSound(880, 0.25);
              if (currentExerciseIndex < activeWorkout.exercises.length - 1) {
                setPlayerPhase('rest');
                setRestSeconds(activeWorkout.exercises[currentExerciseIndex].restDurationSeconds);
                setCurrentExerciseIndex((idx) => idx + 1);
                setCurrentRep(1);
              } else {
                setPlayerPhase('completed');
                setIsTimerRunning(false);
                setBurnedCalories((c) => c + activeWorkout.caloriesBurned);
                setWeeklyGoal((g) => ({ ...g, completed: Math.min(g.target, g.completed + 1) }));
                playSound(1046, 0.4);
              }
              return 0;
            }
            return prev - 1;
          });

          // Dynamic rep count increment based on elapsed time
          const totalDuration = activeWorkout.exercises[currentExerciseIndex]?.durationSeconds || 30;
          const targetReps = activeWorkout.exercises[currentExerciseIndex]?.repetitionCount || 15;
          const elapsed = totalDuration - timerSeconds;
          const calculatedRep = Math.min(targetReps, Math.max(1, Math.floor((elapsed / totalDuration) * targetReps) + 1));
          setCurrentRep(calculatedRep);

        } else if (playerPhase === 'rest') {
          setRestSeconds((prev) => {
            if (prev <= 4 && prev > 1) {
              playSound(440, 0.08);
            } else if (prev <= 1) {
              playSound(880, 0.2);
              setPlayerPhase('active');
              setTimerSeconds(activeWorkout.exercises[currentExerciseIndex]?.durationSeconds || 30);
              setCurrentRep(1);
              return 15;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [activeWorkout, isTimerRunning, playerPhase, currentExerciseIndex, timerSeconds, isAudioMuted]);

  const handleStartWorkout = (plan: WorkoutPlan) => {
    setActiveWorkout(plan);
    setCurrentExerciseIndex(0);
    setPlayerPhase('ready');
    setReadyCountdown(10);
    setTimerSeconds(plan.exercises[0].durationSeconds);
    setCurrentRep(1);
    setIsTimerRunning(true);
    playSound(660, 0.15);
  };

  const handleOpenExerciseGuide = (plan: WorkoutPlan, index = 0) => {
    setActiveWorkout(plan);
    setCurrentExerciseIndex(index);
    setCustomDuration(plan.exercises[index].durationSeconds);
    setPlayerPhase('guide');
    setIsTimerRunning(false);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">

      {/* --- LIVE INTERACTIVE WORKOUT PLAYER MODAL --- */}
      {activeWorkout && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#EDE9FE] flex flex-col h-[94vh] max-h-[820px] justify-between relative">
            
            {/* 1. EXERCISE GUIDE MODAL */}
            {playerPhase === 'guide' ? (
              <div className="flex-1 flex flex-col justify-between p-5 md:p-6 overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="text-xl font-black text-[#1E293B] tracking-tight uppercase">
                    {currentExercise.name}
                  </h3>
                  <button 
                    onClick={() => {
                      const nextIndex = (currentExerciseIndex + 1) % activeWorkout.exercises.length;
                      setCurrentExerciseIndex(nextIndex);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-[#0066FF] hover:underline cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Replace</span>
                  </button>
                </div>

                <div className="my-3">
                  <StrictBiomechanicalHumanCanvas 
                    exerciseType={currentExercise.animationType} 
                    isPaused={false} 
                  />
                </div>

                <div className="flex items-center p-1 bg-gray-100 rounded-full my-2">
                  <button
                    onClick={() => setGuideTab('video')}
                    className={`flex-1 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                      guideTab === 'video' ? 'bg-[#0066FF] text-white shadow-sm' : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    Movement
                  </button>
                  <button
                    onClick={() => setGuideTab('muscle')}
                    className={`flex-1 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                      guideTab === 'muscle' ? 'bg-[#0066FF] text-white shadow-sm' : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    Target Muscles
                  </button>
                  <button
                    onClick={() => setGuideTab('how_to_do')}
                    className={`flex-1 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                      guideTab === 'how_to_do' ? 'bg-[#0066FF] text-white shadow-sm' : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    Biomechanics
                  </button>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-xs font-black text-[#0066FF] uppercase tracking-wider">DURATION</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCustomDuration((d) => Math.max(5, d - 5))}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center cursor-pointer font-bold"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xl font-black text-[#1E293B] font-mono">
                      00:{customDuration.toString().padStart(2, '0')}
                    </span>
                    <button
                      onClick={() => setCustomDuration((d) => Math.min(120, d + 5))}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center cursor-pointer font-bold"
                    >
                      <PlusIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="my-3 space-y-1.5 text-left">
                  <h4 className="text-xs font-black text-[#0066FF] uppercase tracking-wider">EXACT MOVEMENT INSTRUCTIONS</h4>
                  <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line font-medium">
                    {currentExercise.instructionsFull}
                  </p>
                </div>

                <div className="my-2 space-y-1.5 text-left">
                  <h4 className="text-xs font-black text-[#0066FF] uppercase tracking-wider">KEY BIOMECHANICAL CUES</h4>
                  <div className="space-y-1">
                    {currentExercise.biomechanicsSteps?.map((step, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 gap-3">
                  <button
                    onClick={() => {
                      setPlayerPhase('active');
                      setTimerSeconds(customDuration);
                      setIsTimerRunning(true);
                    }}
                    className="w-full py-3.5 bg-[#0066FF] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all cursor-pointer text-center"
                  >
                    CLOSE & START WORKOUT
                  </button>
                </div>
              </div>
            ) : playerPhase === 'completed' ? (
              /* 2. COMPLETION SUMMARY */
              <div className="p-8 text-center space-y-6 my-auto">
                <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-4xl shadow-lg animate-bounce">
                  🏆
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#1E293B]">WORKOUT COMPLETED!</h3>
                  <p className="text-xs text-gray-500 mt-1 font-medium">Logged to your female health & metabolic vitality record.</p>
                </div>
                <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Burned</span>
                    <span className="text-2xl font-black text-[#7C3AED]">+{activeWorkout.caloriesBurned}</span>
                    <span className="text-[10px] text-gray-400 block">kcal</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Duration</span>
                    <span className="text-2xl font-black text-[#0066FF]">{activeWorkout.durationMinutes}</span>
                    <span className="text-[10px] text-gray-400 block">mins</span>
                  </div>
                </div>
                <button
                  onClick={() => { setActiveWorkout(null); setIsTimerRunning(false); }}
                  className="w-full py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm rounded-2xl shadow-lg cursor-pointer"
                >
                  Save & Return to Dashboard
                </button>
              </div>
            ) : playerPhase === 'rest' ? (
              /* 3. REST INTERVAL */
              <div className="p-8 text-center space-y-6 my-auto">
                <span className="text-xs font-black text-[#7C3AED] uppercase tracking-widest bg-purple-100 px-4 py-1.5 rounded-full border border-purple-200">
                  Take a Breath • Rest
                </span>
                <h3 className="text-6xl font-black text-[#1E293B] font-mono tracking-tight">
                  00:{restSeconds.toString().padStart(2, '0')}
                </h3>
                <p className="text-xs text-gray-500">
                  Next: <strong className="text-[#0066FF]">{activeWorkout.exercises[currentExerciseIndex]?.name}</strong>
                </p>
                <button
                  onClick={() => {
                    setPlayerPhase('active');
                    setTimerSeconds(activeWorkout.exercises[currentExerciseIndex]?.durationSeconds || 30);
                  }}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#3a3135] font-bold text-xs rounded-xl cursor-pointer"
                >
                  Skip Rest →
                </button>
              </div>
            ) : (
              /* 4. PROFESSIONAL WORKOUT PLAYER */
              <div className="flex-1 flex flex-col justify-between p-5 md:p-6">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <button 
                    onClick={() => { setActiveWorkout(null); setIsTimerRunning(false); }}
                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="text-center">
                    <span className="text-xs font-black text-[#0066FF] uppercase tracking-wider block">
                      {currentExercise.name}
                    </span>
                    <span className="text-[11px] font-bold text-gray-400">
                      Exercise {currentExerciseIndex + 1} / {activeWorkout.exercises.length}
                    </span>
                  </div>
                  <button 
                    onClick={() => setPlayerPhase('guide')}
                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 cursor-pointer"
                    title="Open Guide"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>

                <div className="my-2">
                  <StrictBiomechanicalHumanCanvas 
                    exerciseType={currentExercise.animationType} 
                    isPaused={!isTimerRunning} 
                  />
                </div>

                {/* Reps & Timer Counter */}
                <div className="flex items-center justify-between px-2">
                  <div className="bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-xl">
                    <span className="text-xs font-black text-[#0066FF] tracking-tight">
                      {currentRep} / {currentExercise.repetitionCount} REPS
                    </span>
                  </div>
                  <h2 className="text-4xl font-black text-[#1E293B] font-mono tracking-tight">
                    {formatTimer(timerSeconds)}
                  </h2>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden my-2">
                  <div 
                    className="bg-[#0066FF] h-full transition-all duration-300 rounded-full"
                    style={{ 
                      width: `${((currentExerciseIndex + (currentRep / currentExercise.repetitionCount)) / activeWorkout.exercises.length) * 100}%` 
                    }}
                  />
                </div>

                {/* Media Controls */}
                <div className="flex items-center justify-center gap-4 pt-1">
                  <button
                    onClick={() => {
                      if (currentExerciseIndex > 0) {
                        setCurrentExerciseIndex(currentExerciseIndex - 1);
                        setTimerSeconds(activeWorkout.exercises[currentExerciseIndex - 1].durationSeconds);
                        setCurrentRep(1);
                      }
                    }}
                    disabled={currentExerciseIndex === 0}
                    className="w-13 h-13 rounded-2xl bg-gray-100 hover:bg-gray-200 disabled:opacity-30 text-gray-700 flex items-center justify-center cursor-pointer"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="flex-1 py-3.5 rounded-2xl bg-[#0066FF] hover:bg-blue-700 text-white font-black text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-200 cursor-pointer"
                  >
                    {isTimerRunning ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>PAUSE</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>RESUME</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      if (currentExerciseIndex < activeWorkout.exercises.length - 1) {
                        setCurrentExerciseIndex(currentExerciseIndex + 1);
                        setTimerSeconds(activeWorkout.exercises[currentExerciseIndex + 1].durationSeconds);
                        setCurrentRep(1);
                      } else {
                        setPlayerPhase('completed');
                        setIsTimerRunning(false);
                      }
                    }}
                    className="w-13 h-13 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center cursor-pointer"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* --- CLINICAL PATIENT HEALTH DISCOVERY HUB --- */}
      <div className="bg-white rounded-3xl p-6 border border-[#EDE9FE] shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-[#3a3135] tracking-tight">DOCTOR-PRESCRIBED EXERCISES & PROTOCOLS</h2>
            <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-purple-100 text-[#7C3AED] flex items-center gap-1 border border-purple-200">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Doctor Prescribed
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              ✓ Clinical Safety Verified
            </span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search prescribed protocols..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF8FC] border border-[#EDE9FE] text-xs font-medium focus:border-[#7C3AED] outline-none"
            />
          </div>
        </div>

        {/* --- PATIENT MEDICAL CONDITION FILTER TABS --- */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: '🩺 All Doctor Prescriptions', count: WORKOUT_PLANS.length },
            { id: 'pcos', label: '🌸 PCOS & Insulin (Endo)', count: 1 },
            { id: 'prenatal', label: '🤰 Prenatal Trimesters (OB/GYN)', count: 1 },
            { id: 'postpartum', label: '👶 Postpartum Diastasis (PT)', count: 1 },
            { id: 'menstrual', label: '🩸 Menstrual & Endo Relief (Gyn)', count: 1 },
            { id: 'menopause', label: '🦴 Menopause Bone Density (Ortho)', count: 1 },
            { id: 'cardio', label: '❤️ Cardiometabolic Flow (Cardio)', count: 1 },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-[#7C3AED] text-white shadow-md shadow-purple-200 ring-2 ring-purple-300'
                  : 'bg-[#FAF8FC] hover:bg-purple-50 text-gray-700 border border-[#EDE9FE]'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedCategory === cat.id ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* --- ATTENDING DOCTOR'S PERSONALIZED PRESCRIPTIONS (IF ANY) --- */}
        {consultationAdvice && consultationAdvice.length > 0 && (
          <div className="p-5 rounded-3xl bg-[#FAF5FF] border border-purple-200 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                Rx
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#3a3135]">Attending Physician's Clinical Exercise & Movement Orders</h4>
                <p className="text-[11px] text-[#7a6f75]">Personalized physical therapy and lifestyle advice prescribed during your doctor consultations</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {consultationAdvice.map((cons) => (
                <div key={cons.id} className="p-4 rounded-2xl bg-white border border-[#EDE9FE] space-y-2 text-xs shadow-2xs">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <span className="font-bold text-[#7C3AED]">
                      {cons.doctor_name || 'Attending Specialist'}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {cons.created_at ? new Date(cons.created_at).toLocaleDateString() : 'Active Prescription'}
                    </span>
                  </div>
                  {cons.specialization && (
                    <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md inline-block">
                      {cons.specialization} • {cons.hospital_clinic || 'FemSphere Health'}
                    </span>
                  )}
                  <div>
                    <span className="font-bold text-gray-500 block text-[10px] uppercase">Diagnosis:</span>
                    <p className="font-medium text-gray-800">{cons.diagnosis}</p>
                  </div>
                  <div>
                    <span className="font-bold text-emerald-700 block text-[10px] uppercase">Prescribed Therapy / Movement:</span>
                    <p className="text-gray-700 whitespace-pre-line">{cons.advice}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- PATIENT CLINICAL SAFEGUARD BANNER --- */}
        <div className="rounded-3xl bg-gradient-to-r from-[#7C3AED] via-purple-700 to-indigo-900 text-white p-6 md:p-8 overflow-hidden shadow-xl relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-white/20 text-purple-100 border border-white/30 inline-block">
                🩺 Clinical Exercise Prescription
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/40">
                100% Doctor Prescribed & Contraindication Filtered
              </span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
              Clinical Exercise Therapy Prescribed by Your Physicians
            </h3>
            <p className="text-xs md:text-sm text-purple-100/90 leading-relaxed font-light">
              Movement regimens certified by attending specialists (OB/GYN, Endocrinology, Pelvic Floor Physical Therapy, and Orthopedics). Biomechanically guided, contraindication-safe, and calibrated to your active life stage.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  const filtered = selectedCategory === 'all' 
                    ? WORKOUT_PLANS[0] 
                    : WORKOUT_PLANS.find(p => p.patientCondition === selectedCategory) || WORKOUT_PLANS[0];
                  handleStartWorkout(filtered);
                }}
                className="px-8 py-3.5 bg-white text-[#7C3AED] hover:bg-purple-50 font-black text-sm rounded-full shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Start Doctor-Prescribed Routine</span>
                <span>🚀</span>
              </button>
              <button
                onClick={() => {
                  const filtered = selectedCategory === 'all' 
                    ? WORKOUT_PLANS[0] 
                    : WORKOUT_PLANS.find(p => p.patientCondition === selectedCategory) || WORKOUT_PLANS[0];
                  handleOpenExerciseGuide(filtered, 0);
                }}
                className="px-6 py-3.5 bg-white/20 hover:bg-white/30 text-white font-bold text-sm rounded-full border border-white/30 transition-all cursor-pointer"
              >
                View Biomechanical Form 📖
              </button>
            </div>
          </div>
        </div>

        {/* --- PATIENT WORKOUT PLANS GRID --- */}
        <div className="grid md:grid-cols-3 gap-5">
          {WORKOUT_PLANS
            .filter((plan) => {
              if (selectedCategory !== 'all' && plan.patientCondition !== selectedCategory) return false;
              if (searchQuery) {
                const q = searchQuery.toLowerCase();
                return plan.title.toLowerCase().includes(q) || 
                       plan.description.toLowerCase().includes(q) ||
                       plan.exercises.some(e => e.name.toLowerCase().includes(q));
              }
              return true;
            })
            .map((plan) => (
              <div
                key={plan.id}
                className="bg-[#FAF8FC] rounded-3xl p-5 border border-[#EDE9FE] hover:border-[#7C3AED] transition-all flex flex-col justify-between space-y-4 group shadow-2xs relative"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-black text-[#7C3AED] uppercase tracking-wider bg-purple-100/70 px-3 py-1 rounded-full border border-purple-200">
                      {plan.category}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {plan.clinicalApproval.split('&')[0]}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-black text-lg text-[#3a3135] group-hover:text-[#7C3AED] transition-colors leading-snug">
                      {plan.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Medical Safeguard pill */}
                  <div className="p-3 rounded-2xl bg-white border border-[#EDE9FE] space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-gray-500">Target Heart Rate:</span>
                      <span className="text-[#7C3AED]">{plan.targetHeartRateBpm}</span>
                    </div>
                    <div className="text-[11px] text-gray-600 font-medium leading-tight">
                      <span className="font-bold text-amber-700">Safeguard: </span>
                      {plan.safetySafeguards}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                    <span>⏱️ {plan.durationMinutes} mins</span>
                    <span>🔥 {plan.caloriesBurned} kcal</span>
                    <span>🤸 {plan.exercises.length} Exercises</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {plan.exercises.map((ex, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleOpenExerciseGuide(plan, i)}
                        className="text-[10px] font-bold bg-white hover:bg-purple-50 px-2.5 py-1 rounded-lg border border-[#EDE9FE] text-gray-700 cursor-pointer"
                      >
                        {ex.name}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleStartWorkout(plan)}
                    className="w-full py-3.5 bg-white hover:bg-[#7C3AED] text-[#7C3AED] hover:text-white border-2 border-[#7C3AED] rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Prescribed Workout</span>
                  </button>
                </div>
              </div>
            ))}
        </div>

      </div>

      {/* --- CALORIE & HYDRATION METRICS (ONLY IF NOT PRESCRIBED-ONLY) --- */}
      {!prescribedOnly && (
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-[#EDE9FE] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Calorie Balance</span>
              <Flame className="w-4 h-4 text-rose-500" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <h4 className="text-2xl font-black text-[#3a3135]">{remainingCalories}</h4>
                <span className="text-xs text-gray-400">kcal remaining</span>
              </div>
              <div className="text-right text-xs">
                <span className="text-emerald-700 font-bold block">-{burnedCalories} burned</span>
                <span className="text-amber-600 font-bold block">+{foodCalories} eaten</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#EDE9FE] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Daily Steps</span>
              <Footprints className="w-4 h-4 text-[#7C3AED]" />
            </div>
            <h4 className="text-2xl font-black text-[#3a3135]">{steps.toLocaleString()}</h4>
            <p className="text-xs text-purple-700 font-semibold">5.8 km • 48 active mins</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#EDE9FE] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hydration</span>
              <Droplets className="w-4 h-4 text-sky-600" />
            </div>
            <h4 className="text-2xl font-black text-[#3a3135]">{(waterGlasses * 0.25).toFixed(1)}L <span className="text-xs font-normal text-gray-400">/ 3.0L</span></h4>
          </div>
        </div>
      )}

    </div>
  );
}
