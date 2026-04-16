/**
 * GSAP Animation Configuration
 * Centralized settings for consistency and easy adjustments
 */

export const ANIMATION_CONFIG = {
  // Duration settings
  duration: {
    fast: 0.3,
    normal: 0.6,
    slow: 1.2,
    stagger: 0.1,
    scene: 1.5,
  },
  
  // Easing functions
  ease: {
    main: 'power3.out',
    inOut: 'power2.inOut',
    bounce: 'back.out(1.7)',
    smooth: 'expo.out',
    immersive: 'slow(0.7, 0.7, false)',
  },

  // ScrollTrigger defaults
  scrollTrigger: {
    start: 'top 85%',
    toggleActions: 'play none none reverse',
  },

  // Entrance animations
  entrance: {
    y: 50,
    opacity: 0,
    scale: 0.9,
    rotation: 5,
  },

  // Micro-interactions
  hover: {
    scale: 1.05,
    duration: 0.2,
  },

  // 3D Effects
  threeD: {
    rotationY: 15,
    perspective: 1000,
  }
};

/**
 * Common GSAP animation presets
 */
export const presets = {
  fadeInUp: (customDelay = 0) => ({
    y: ANIMATION_CONFIG.entrance.y,
    opacity: 0,
    duration: ANIMATION_CONFIG.duration.normal,
    ease: ANIMATION_CONFIG.ease.main,
    delay: customDelay,
  }),
  
  staggeredEntrance: () => ({
    y: 30,
    opacity: 0,
    duration: ANIMATION_CONFIG.duration.normal,
    stagger: ANIMATION_CONFIG.duration.stagger,
    ease: ANIMATION_CONFIG.ease.main,
  }),

  immersiveEntrance: () => ({
    scale: 1.1,
    opacity: 0,
    filter: 'blur(10px)',
    duration: ANIMATION_CONFIG.duration.scene,
    ease: ANIMATION_CONFIG.ease.smooth,
  }),

  threeDFlip: () => ({
    rotationY: ANIMATION_CONFIG.threeD.rotationY,
    transformPerspective: ANIMATION_CONFIG.threeD.perspective,
    ease: ANIMATION_CONFIG.ease.main,
  })
};
