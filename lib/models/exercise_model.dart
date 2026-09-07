class Exercise {
  final String id;
  final String name;
  final String category;
  final int durationSeconds;
  final int repetitionCount;
  final int calories;
  final String difficulty;
  final List<String> focusAreas;
  final String instructions;
  final List<String> biomechanicsSteps;
  final List<String> tips;
  final int restDurationSeconds;
  final String animationType;

  const Exercise({
    required this.id,
    required this.name,
    required this.category,
    required this.durationSeconds,
    this.repetitionCount = 15,
    required this.calories,
    required this.difficulty,
    required this.focusAreas,
    required this.instructions,
    this.biomechanicsSteps = const [],
    required this.tips,
    this.restDurationSeconds = 15,
    required this.animationType,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'category': category,
    'durationSeconds': durationSeconds,
    'repetitionCount': repetitionCount,
    'calories': calories,
    'difficulty': difficulty,
    'focusAreas': focusAreas,
    'instructions': instructions,
    'biomechanicsSteps': biomechanicsSteps,
    'tips': tips,
    'restDurationSeconds': restDurationSeconds,
    'animationType': animationType,
  };

  factory Exercise.fromJson(Map<String, dynamic> json) => Exercise(
    id: json['id'] as String,
    name: json['name'] as String,
    category: json['category'] as String? ?? 'General',
    durationSeconds: json['durationSeconds'] as int? ?? 30,
    repetitionCount: json['repetitionCount'] as int? ?? 15,
    calories: json['calories'] as int? ?? 25,
    difficulty: json['difficulty'] as String? ?? 'All Levels',
    focusAreas: (json['focusAreas'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
    instructions: json['instructions'] as String? ?? '',
    biomechanicsSteps: (json['biomechanicsSteps'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
    tips: (json['tips'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
    restDurationSeconds: json['restDurationSeconds'] as int? ?? 15,
    animationType: json['animationType'] as String? ?? 'squat',
  );
}

class WorkoutPlan {
  final String id;
  final String title;
  final String category;
  final int durationMinutes;
  final int caloriesBurned;
  final String level;
  final String description;
  final List<Exercise> exercises;

  const WorkoutPlan({
    required this.id,
    required this.title,
    required this.category,
    required this.durationMinutes,
    required this.caloriesBurned,
    required this.level,
    required this.description,
    required this.exercises,
  });
}

// 24 CORE EXERCISES REGISTRY (STRICT BIOMECHANICS)
class ExerciseCatalog {
  static const List<Exercise> allExercises = [
    Exercise(
      id: 'squats',
      name: 'SQUATS',
      category: 'Lower Body Strength',
      durationSeconds: 30,
      repetitionCount: 15,
      calories: 30,
      difficulty: 'Beginner',
      focusAreas: ['Glutes', 'Quadriceps', 'Hamstrings', 'Pelvic Floor'],
      instructions: 'Feet shoulder-width apart, hips move backward and downward, knees bend to 90 degrees and track over feet, return to standing.',
      biomechanicsSteps: [
        'Feet remain stationary shoulder-width apart',
        'Hips hinge back and down to 90-degree thigh depth',
        'Knees track over second toe without collapsing',
        'Torso remains upright with neutral spine',
      ],
      tips: ['Weight in heels', 'Keep chest open and proud', 'Exhale rising up'],
      animationType: 'squat',
    ),
    Exercise(
      id: 'jumping_jacks',
      name: 'JUMPING JACKS',
      category: 'Cardio & Lymphatic',
      durationSeconds: 30,
      repetitionCount: 25,
      calories: 35,
      difficulty: 'All Levels',
      focusAreas: ['Shoulders', 'Quadriceps', 'Calves', 'Cardiovascular'],
      instructions: 'Start standing with feet together and arms down. Jump feet outward while raising arms overhead. Return feet together while lowering arms.',
      biomechanicsSteps: [
        'Soft knee landings to absorb impact',
        'Arms swing through full lateral arc overhead',
        'Cadence remains steady and rhythmic',
      ],
      tips: ['Land softly on balls of feet', 'Keep core engaged', 'Breathe smoothly'],
      animationType: 'jumping_jack',
    ),
    Exercise(
      id: 'lunges',
      name: 'FORWARD LUNGES',
      category: 'Lower Body & Balance',
      durationSeconds: 30,
      repetitionCount: 14,
      calories: 28,
      difficulty: 'Intermediate',
      focusAreas: ['Quadriceps', 'Gluteus Medius', 'Hip Flexors'],
      instructions: 'One leg steps forward, front knee bends tracking over foot, rear knee moves toward floor, torso remains upright, return to start.',
      biomechanicsSteps: [
        'Vertical torso posture throughout',
        'Front knee stacked over ankle at 90 degrees',
        'Back knee hovers 2 inches above ground',
      ],
      tips: ['Drive through front heel', 'Keep hips square'],
      animationType: 'lunge',
    ),
    Exercise(
      id: 'high_knees',
      name: 'HIGH KNEES',
      category: 'HIIT Cardio',
      durationSeconds: 30,
      repetitionCount: 30,
      calories: 40,
      difficulty: 'Intermediate',
      focusAreas: ['Hip Flexors', 'Lower Abs', 'Cardiovascular'],
      instructions: 'Remain upright and alternate lifting each knee toward chest while maintaining a controlled running-in-place movement.',
      biomechanicsSteps: [
        'Knee reaches true 90-degree hip level',
        'Ankle dorsiflexed on lifting leg',
        'Light bouncy landings on forefeet',
      ],
      tips: ['Stay light on toes', 'Pump arms in rhythm'],
      animationType: 'high_knees',
    ),
    Exercise(
      id: 'mountain_climbers',
      name: 'MOUNTAIN CLIMBERS',
      category: 'Core & Cardio',
      durationSeconds: 30,
      repetitionCount: 28,
      calories: 38,
      difficulty: 'Intermediate',
      focusAreas: ['Abdominals', 'Deltoids', 'Quadriceps'],
      instructions: 'Start in a high plank. Keep hands planted while alternating bringing each knee toward chest. Maintain stable upper body.',
      biomechanicsSteps: [
        'Hands planted directly under shoulders',
        'Knees drive along sagittal center under torso',
        'Hips remain level with spine without bouncing',
      ],
      tips: ['Keep hands firmly planted', 'Do not bounce hips up'],
      animationType: 'mountain_climber',
    ),
    Exercise(
      id: 'push_ups',
      name: 'PUSH-UPS',
      category: 'Upper Body & Core',
      durationSeconds: 30,
      repetitionCount: 12,
      calories: 26,
      difficulty: 'Intermediate',
      focusAreas: ['Pectorals', 'Triceps', 'Anterior Deltoids', 'Core'],
      instructions: 'Hands remain planted, body stays in straight line, elbows bend naturally, chest moves toward floor, then push back to starting position.',
      biomechanicsSteps: [
        'Rigid head-to-heel straight body line',
        'Elbows bend at 45-degree angle (arrow shape)',
        'Full arm lockout at top of repetition',
      ],
      tips: ['Squeeze glutes and core', 'Keep neck neutral'],
      animationType: 'push_up',
    ),
    Exercise(
      id: 'plank',
      name: 'PLANK HOLD',
      category: 'Core & Stability',
      durationSeconds: 30,
      repetitionCount: 1,
      calories: 25,
      difficulty: 'All Levels',
      focusAreas: ['Transverse Abdominis', 'Core Stabilizers', 'Lower Back'],
      instructions: 'Body remains in a straight line from head to heels, core remains stable, elbows/hands stay fixed, no unnecessary hip movement.',
      biomechanicsSteps: [
        'Forearms flat under shoulders',
        'Posterior pelvic tilt engaging lower abs',
        'Continuous deep diaphragmatic breathing',
      ],
      tips: ['Squeeze glutes tight', 'Do not let hips sag'],
      animationType: 'plank',
    ),
    Exercise(
      id: 'glute_bridge',
      name: 'GLUTE BRIDGE',
      category: 'Glute & Pelvic Health',
      durationSeconds: 30,
      repetitionCount: 15,
      calories: 22,
      difficulty: 'Beginner',
      focusAreas: ['Gluteus Maximus', 'Hamstrings', 'Pelvic Floor'],
      instructions: 'Lie on the back with knees bent and feet planted. Lift hips upward while keeping torso aligned, then lower hips in controlled manner.',
      biomechanicsSteps: [
        'Feet planted flat hip-width apart',
        'Drive through heels to straight knee-shoulder diagonal',
        'Peak glute squeeze with neutral ribcage',
      ],
      tips: ['Press firmly through heels', 'Do not hyperextend spine'],
      animationType: 'glute_bridge',
    ),
    Exercise(
      id: 'side_leg_raises',
      name: 'SIDE LEG RAISES',
      category: 'Hip & Glute Tone',
      durationSeconds: 30,
      repetitionCount: 16,
      calories: 20,
      difficulty: 'Beginner',
      focusAreas: ['Gluteus Medius', 'Outer Thighs', 'Hip Stabilizers'],
      instructions: 'Maintain balance with supporting leg stable. Raise opposite leg sideways in controlled motion without rotating torso.',
      biomechanicsSteps: [
        'Pure lateral hip abduction to 45 degrees',
        'Toes point straight forward (no external rotation)',
        'Torso remains completely upright without leaning',
      ],
      tips: ['Do not tilt torso', 'Keep core braced'],
      animationType: 'side_leg_raise',
    ),
    Exercise(
      id: 'arm_circles',
      name: 'ARM CIRCLES',
      category: 'Shoulder Sculpt',
      durationSeconds: 30,
      repetitionCount: 20,
      calories: 25,
      difficulty: 'All Levels',
      focusAreas: ['Deltoids', 'Upper Back', 'Rotator Cuff'],
      instructions: 'Extend arms horizontally straight out at shoulder level. Make controlled 360-degree circular motions clockwise without swaying.',
      biomechanicsSteps: [
        'Arms locked straight at 90-degree horizontal line',
        'Pure glenohumeral rotation without shoulder elevation',
        'Torso stays motionless and upright',
      ],
      tips: ['Keep shoulder blades down', 'Maintain relaxed neck'],
      animationType: 'arm_circle',
    ),
    Exercise(
      id: 'butt_kicks',
      name: 'BUTT KICKS',
      category: 'Cardio & Warmup',
      durationSeconds: 30,
      repetitionCount: 30,
      calories: 32,
      difficulty: 'Beginner',
      focusAreas: ['Hamstrings', 'Quadriceps Stretch', 'Cardiovascular'],
      instructions: 'Jog in place on balls of feet, kicking heels up to touch glutes on every stride while keeping knees pointing down.',
      biomechanicsSteps: [
        'Knees point directly toward floor',
        'Heels travel straight upward to contact glutes',
        'Light bouncy cadence on forefeet',
      ],
      tips: ['Chest upright', 'Keep knees down'],
      animationType: 'butt_kick',
    ),
    Exercise(
      id: 'bicycle_crunches',
      name: 'BICYCLE CRUNCHES',
      category: 'Obliques & Core',
      durationSeconds: 30,
      repetitionCount: 20,
      calories: 30,
      difficulty: 'Intermediate',
      focusAreas: ['Obliques', 'Rectus Abdominis', 'Hip Flexors'],
      instructions: 'Lie on back, elevate shoulder blades, and alternate driving elbow to opposite knee while extending other leg straight.',
      biomechanicsSteps: [
        'Shoulder blades stay elevated off floor',
        'Torso rotates from thoracic spine toward knee',
        'Opposite leg extends straight at 45-degree angle',
      ],
      tips: ['Do not pull on neck', 'Rotate with core'],
      animationType: 'bicycle_crunch',
    ),
    Exercise(
      id: 'bird_dog',
      name: 'BIRD DOG',
      category: 'Spine & Core Stability',
      durationSeconds: 30,
      repetitionCount: 14,
      calories: 20,
      difficulty: 'Beginner',
      focusAreas: ['Erector Spinae', 'Glutes', 'Core Stabilizers'],
      instructions: 'Start on hands and knees. Extend opposite arm and leg while keeping spine stable. Return to start position and alternate.',
      biomechanicsSteps: [
        'Spine remains neutral (no lumbar arching)',
        'Arm and leg reach parallel to floor line',
        'Hips stay square to floor',
      ],
      tips: ['Keep hips level', 'Reach straight out'],
      animationType: 'bird_dog',
    ),
    Exercise(
      id: 'standing_knee_raises',
      name: 'STANDING KNEE RAISES',
      category: 'Core & Hip Flexors',
      durationSeconds: 30,
      repetitionCount: 20,
      calories: 25,
      difficulty: 'Beginner',
      focusAreas: ['Lower Abs', 'Hip Flexors', 'Balance'],
      instructions: 'Stand tall and raise one knee to chest level contracting abdominals, lower with control and alternate.',
      biomechanicsSteps: [
        'Supporting leg planted with micro-bend',
        'Knee lifts to 90 degrees with active core crunch',
        'Controlled eccentric descent',
      ],
      tips: ['Keep chest up', 'Exhale lifting knee'],
      animationType: 'standing_knee_raise',
    ),
    Exercise(
      id: 'calf_raises',
      name: 'CALF RAISES',
      category: 'Lower Leg Strength',
      durationSeconds: 30,
      repetitionCount: 20,
      calories: 18,
      difficulty: 'Beginner',
      focusAreas: ['Gastrocnemius', 'Soleus', 'Ankle Stability'],
      instructions: 'Stand shoulder-width apart, press through balls of feet lifting heels high, pause for 1 second and lower slowly.',
      biomechanicsSteps: [
        'Pure vertical lift without forward torso lean',
        'Full plantarflexion onto big toe metatarsals',
        'Slow 2-second controlled lowering',
      ],
      tips: ['Pause at the top', 'Control the descent'],
      animationType: 'calf_raise',
    ),
    Exercise(
      id: 'crunches',
      name: 'CRUNCHES',
      category: 'Abdominal Strength',
      durationSeconds: 30,
      repetitionCount: 18,
      calories: 22,
      difficulty: 'Beginner',
      focusAreas: ['Upper Abs', 'Rectus Abdominis'],
      instructions: 'Lie on back with knees bent. Curl ribcage toward pelvis lifting shoulder blades off floor, lower slowly.',
      biomechanicsSteps: [
        'Lower back stays pressed flat into floor',
        'Thoracic flexion lifts shoulder blades 3-4 inches',
        'Chin stays off chest with gaze toward ceiling',
      ],
      tips: ['Do not yank neck', 'Exhale on crunch'],
      animationType: 'crunch',
    ),
    Exercise(
      id: 'russian_twists',
      name: 'RUSSIAN TWISTS',
      category: 'Obliques & Rotation',
      durationSeconds: 30,
      repetitionCount: 24,
      calories: 32,
      difficulty: 'Intermediate',
      focusAreas: ['Obliques', 'Transverse Abdominis', 'Hip Flexors'],
      instructions: 'Sit in V-sit position with feet hovered. Rotate torso from left to right touching hands to floor on each side.',
      biomechanicsSteps: [
        'Torso held at 45-degree angle with straight spine',
        'Shoulders rotate fully side to side',
        'Knees and hips stay stable and centered',
      ],
      tips: ['Rotate from ribcage', 'Keep chest open'],
      animationType: 'russian_twist',
    ),
    Exercise(
      id: 'step_ups',
      name: 'STEP-UPS',
      category: 'Lower Body Power',
      durationSeconds: 30,
      repetitionCount: 16,
      calories: 34,
      difficulty: 'Intermediate',
      focusAreas: ['Quadriceps', 'Glutes', 'Balance'],
      instructions: 'Plant lead foot firmly on step. Drive through heel to stand straight up on platform, step down and alternate.',
      biomechanicsSteps: [
        'Entire foot planted flat on step',
        'Drive through lead heel to full knee extension',
        'Controlled step back to floor',
      ],
      tips: ['Do not push off back toe', 'Stand tall at peak'],
      animationType: 'step_up',
    ),
    Exercise(
      id: 'wall_sit',
      name: 'WALL SIT',
      category: 'Isometric Quad Endurance',
      durationSeconds: 30,
      repetitionCount: 1,
      calories: 25,
      difficulty: 'Intermediate',
      focusAreas: ['Quadriceps', 'Glutes', 'Calves'],
      instructions: 'Slide back down wall until thighs are parallel to floor at 90 degrees. Hold position with arms extended.',
      biomechanicsSteps: [
        'Thighs parallel to floor (90-degree knee bend)',
        'Back pressed flat against wall',
        'Knees stacked directly over ankles',
      ],
      tips: ['Keep weight in heels', 'Breathe steadily'],
      animationType: 'wall_sit',
    ),
    Exercise(
      id: 'child_pose',
      name: 'CHILD\'S POSE',
      category: 'Recovery & Flexibility',
      durationSeconds: 30,
      repetitionCount: 1,
      calories: 12,
      difficulty: 'All Levels',
      focusAreas: ['Spine Lengthening', 'Hips', 'Shoulders', 'Relaxation'],
      instructions: 'Kneel with knees wide, sit hips back onto heels, reach arms forward along floor and rest forehead down.',
      biomechanicsSteps: [
        'Hips sink deeply onto heels',
        'Arms reach forward active along floor',
        'Deep diaphragmatic breathing expanding ribcage',
      ],
      tips: ['Relax jaw and shoulders', 'Breathe into lower back'],
      animationType: 'child_pose',
    ),
    Exercise(
      id: 'cat_cow',
      name: 'CAT-COW STRETCH',
      category: 'Spine Mobility',
      durationSeconds: 30,
      repetitionCount: 10,
      calories: 15,
      difficulty: 'All Levels',
      focusAreas: ['Spine Mobility', 'Neck', 'Pelvic Alignment'],
      instructions: 'On all fours, inhale to arch back and lift chest (Cow), exhale to round spine and tuck chin (Cat).',
      biomechanicsSteps: [
        'Inhale: belly drops, pelvis tilts anteriorly, chest opens',
        'Exhale: spine domes upward, pelvis tucks, chin to chest',
        'Fluid sequential articulation of vertebrae',
      ],
      tips: ['Flow with the breath', 'Hands under shoulders'],
      animationType: 'cat_cow',
    ),
    Exercise(
      id: 'hip_flexor_stretch',
      name: 'HIP FLEXOR STRETCH',
      category: 'Pelvic & Hip Mobility',
      durationSeconds: 30,
      repetitionCount: 2,
      calories: 14,
      difficulty: 'All Levels',
      focusAreas: ['Psoas', 'Iliacus', 'Quadriceps', 'Posture'],
      instructions: 'Half-kneeling lunge position. Tuck tailbone under and gently shift hips forward to stretch front of rear hip.',
      biomechanicsSteps: [
        'Posterior pelvic tilt engages glute on rear leg',
        'Torso stays vertical without overarching lower back',
        'Gentle forward shift into anterior hip stretch',
      ],
      tips: ['Squeeze back glute', 'Keep torso tall'],
      animationType: 'hip_flexor_stretch',
    ),
    Exercise(
      id: 'hamstring_stretch',
      name: 'HAMSTRING STRETCH',
      category: 'Posterior Chain Flexibility',
      durationSeconds: 30,
      repetitionCount: 2,
      calories: 14,
      difficulty: 'All Levels',
      focusAreas: ['Hamstrings', 'Calves', 'Lower Back'],
      instructions: 'Extend one leg forward with heel on ground and toes up. Hinge at hips with flat back reaching toward toes.',
      biomechanicsSteps: [
        'Hinge initiates at hip crease with neutral spine',
        'Front knee remains straight with flexed ankle',
        'Zero bouncing or rounding of upper back',
      ],
      tips: ['Hinge from hips', 'Do not round spine'],
      animationType: 'hamstring_stretch',
    ),
    Exercise(
      id: 'shoulder_stretch',
      name: 'SHOULDER STRETCH',
      category: 'Upper Body Mobility',
      durationSeconds: 30,
      repetitionCount: 2,
      calories: 12,
      difficulty: 'All Levels',
      focusAreas: ['Posterior Deltoids', 'Rotator Cuff', 'Upper Back'],
      instructions: 'Bring one straight arm across chest horizontally. Use opposite arm to gently pull elbow in toward body.',
      biomechanicsSteps: [
        'Stretching arm stays straight at shoulder height',
        'Shoulder stays pressed down away from ear',
        'Torso remains square forward without twisting',
      ],
      tips: ['Keep shoulder down', 'Hold steady without force'],
      animationType: 'shoulder_stretch',
    ),
  ];

  static List<WorkoutPlan> defaultPlans = [
    WorkoutPlan(
      id: 'pcos_metabolic_protocol',
      title: 'PCOS Insulin Balance & Strength',
      category: 'PCOS & Hormone Health',
      durationMinutes: 18,
      caloriesBurned: 185,
      level: 'All Levels',
      description: 'Designed for PCOS patients to enhance cellular insulin sensitivity and build lean metabolic muscle without adrenal cortisol spikes.',
      exercises: [
        allExercises[0], // Squats
        allExercises[7], // Glute Bridge
        allExercises[8], // Side Leg Raises
        allExercises[12], // Bird Dog
        allExercises[14], // Calf Raises
        allExercises[9], // Arm Circles
      ],
    ),
    WorkoutPlan(
      id: 'prenatal_trimester_safe',
      title: 'Prenatal Trimester-Safe Pelvic Flow',
      category: 'Prenatal & Pregnancy',
      durationMinutes: 15,
      caloriesBurned: 120,
      level: 'Beginner',
      description: 'Trimester 1, 2, and 3 safe routine to relieve pelvic girdle pressure and strengthen labor muscles. 100% zero belly compression.',
      exercises: [
        allExercises[19], // Child's Pose
        allExercises[20], // Cat-Cow Stretch
        allExercises[8], // Side Leg Raises
        allExercises[18], // Wall Sit
        allExercises[23], // Shoulder Stretch
        allExercises[13], // Standing Knee Raises
      ],
    ),
    WorkoutPlan(
      id: 'postpartum_pelvic_recovery',
      title: 'Postpartum Diastasis & Pelvic Recovery',
      category: 'Postpartum Rehabilitation',
      durationMinutes: 15,
      caloriesBurned: 130,
      level: 'Gentle',
      description: 'Rebuild core integrity, heal diastasis recti, and restore pelvic floor tone safely after childbirth without intra-abdominal strain.',
      exercises: [
        allExercises[7], // Glute Bridge
        allExercises[12], // Bird Dog
        allExercises[20], // Cat-Cow Stretch
        allExercises[13], // Standing Knee Raises
        allExercises[19], // Child's Pose
        allExercises[14], // Calf Raises
      ],
    ),
    WorkoutPlan(
      id: 'menstrual_endo_pain_relief',
      title: 'Menstrual & Endo Pain Relief Flow',
      category: 'Menstrual & Endo Relief',
      durationMinutes: 12,
      caloriesBurned: 95,
      level: 'Restorative',
      description: 'Gentle therapeutic movement to relieve uterine contractions, lower back ache, and pelvic congestion during menstruation.',
      exercises: [
        allExercises[19], // Child's Pose
        allExercises[20], // Cat-Cow Stretch
        allExercises[22], // Hamstring Stretch
        allExercises[21], // Hip Flexor Stretch
        allExercises[7], // Glute Bridge
        allExercises[23], // Shoulder Stretch
      ],
    ),
    WorkoutPlan(
      id: 'menopause_bone_density',
      title: 'Menopause Bone Density & Sarcopenia',
      category: 'Menopause & Bone Strength',
      durationMinutes: 18,
      caloriesBurned: 175,
      level: 'All Levels',
      description: 'Axial-loaded resistance exercises designed for perimenopause and post-menopause bone mineral density and joint lubrication.',
      exercises: [
        allExercises[0], // Squats
        allExercises[14], // Calf Raises
        allExercises[17], // Step-ups
        allExercises[18], // Wall Sit
        allExercises[9], // Arm Circles
        allExercises[13], // Standing Knee Raises
      ],
    ),
    WorkoutPlan(
      id: 'full_body_master',
      title: 'Female Metabolic Conditioning & Tone',
      category: 'General Vitality & Tone',
      durationMinutes: 20,
      caloriesBurned: 220,
      level: 'Intermediate',
      description: 'Comprehensive 8-exercise circuit designed for female metabolic health and posture.',
      exercises: [
        allExercises[0], // Squats
        allExercises[1], // Jumping Jacks
        allExercises[2], // Lunges
        allExercises[3], // High Knees
        allExercises[4], // Mountain Climbers
        allExercises[5], // Push-ups
        allExercises[6], // Plank
        allExercises[7], // Glute Bridge
      ],
    ),
  ];
}
