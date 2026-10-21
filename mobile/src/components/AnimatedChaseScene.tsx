/**
 * GBICH'APP — Animated 2D Comic Chase Scene (Fugitif & Chicotte).
 * Extracted from official design documentation (code_connexion.html).
 */

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

const SVG_ANIMATED_CONTENT = `
<svg height="100%" viewBox="0 0 600 240" width="100%" xmlns="http://www.w3.org/2000/svg" style="display:block; width:100%; height:100%;">
<defs>
<style>
      @keyframes runTrack {
        0% { transform: translateX(0); }
        100% { transform: translateX(-160px); }
      }
      @keyframes runnerFrontBob {
        0%, 100% { transform: translateY(0px) rotate(-4deg); }
        50% { transform: translateY(-10px) rotate(4deg); }
      }
      @keyframes runnerBackBob {
        0%, 100% { transform: translateY(0px) rotate(6deg); }
        50% { transform: translateY(-12px) rotate(-2deg); }
      }
      @keyframes legCycleFront1 {
        0%, 100% { transform: rotate(38deg); }
        50% { transform: rotate(-38deg); }
      }
      @keyframes legCycleFront2 {
        0%, 100% { transform: rotate(-38deg); }
        50% { transform: rotate(38deg); }
      }
      @keyframes armCycleFront1 {
        0%, 100% { transform: rotate(-45deg); }
        50% { transform: rotate(45deg); }
      }
      @keyframes armCycleFront2 {
        0%, 100% { transform: rotate(45deg); }
        50% { transform: rotate(-45deg); }
      }
      @keyframes sweatPop {
        0%, 100% { opacity: 0; transform: scale(0.4) translate(0, 0); }
        50% { opacity: 1; transform: scale(1.2) translate(-15px, -15px); }
      }
      @keyframes dustPuff {
        0% { opacity: 0.9; transform: scale(0.6) translate(0, 0); }
        50% { opacity: 0.5; transform: scale(1.1) translate(-25px, -5px); }
        100% { opacity: 0; transform: scale(1.4) translate(-45px, -12px); }
      }
      @keyframes chappieWobble {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-15deg); }
        75% { transform: rotate(15deg); }
      }

      .bg-ground-line { stroke: #121212; stroke-width: 4; stroke-linecap: round; }
      .speed-line { stroke: #F5222D; stroke-width: 3; stroke-linecap: round; stroke-dasharray: 20 15; animation: runTrack 0.4s linear infinite; }
      .speed-line-dark { stroke: #121212; stroke-width: 3; stroke-linecap: round; stroke-dasharray: 30 20; animation: runTrack 0.3s linear infinite; }
      
      .runner-front { animation: runnerFrontBob 0.32s infinite ease-in-out; transform-origin: 390px 145px; }
      .runner-back { animation: runnerBackBob 0.32s infinite ease-in-out 0.16s; transform-origin: 190px 145px; }
      
      .leg-f1 { transform-origin: 385px 150px; animation: legCycleFront1 0.32s infinite linear; }
      .leg-f2 { transform-origin: 385px 150px; animation: legCycleFront2 0.32s infinite linear; }
      .arm-f1 { transform-origin: 380px 115px; animation: armCycleFront1 0.32s infinite linear; }
      .arm-f2 { transform-origin: 380px 115px; animation: armCycleFront2 0.32s infinite linear; }

      .leg-b1 { transform-origin: 185px 150px; animation: legCycleFront2 0.32s infinite linear; }
      .leg-b2 { transform-origin: 185px 150px; animation: legCycleFront1 0.32s infinite linear; }
      .arm-b1 { transform-origin: 180px 115px; animation: armCycleFront2 0.32s infinite linear; }
      .arm-b2 { transform-origin: 180px 115px; animation: armCycleFront1 0.32s infinite linear; }

      .sweat { animation: sweatPop 0.6s infinite ease-out; }
      .dust1 { animation: dustPuff 0.35s infinite linear; }
      .dust2 { animation: dustPuff 0.35s infinite linear 0.17s; }
      .chappie { animation: chappieWobble 0.25s infinite ease-in-out; transform-origin: 215px 75px; }
</style>
</defs>
<!-- Fond trame de BD -->
<rect fill="#FCF9F6" height="240" rx="16" width="600"></rect>
<!-- Ben-day dots trame discrète -->
<g opacity="0.07">
  <circle cx="30" cy="30" fill="#121212" r="3"></circle>
  <circle cx="60" cy="30" fill="#121212" r="3"></circle>
  <circle cx="90" cy="30" fill="#121212" r="3"></circle>
  <circle cx="120" cy="30" fill="#121212" r="3"></circle>
  <circle cx="150" cy="30" fill="#121212" r="3"></circle>
  <circle cx="180" cy="30" fill="#121212" r="3"></circle>
  <circle cx="210" cy="30" fill="#121212" r="3"></circle>
  <circle cx="240" cy="30" fill="#121212" r="3"></circle>
  <circle cx="270" cy="30" fill="#121212" r="3"></circle>
  <circle cx="300" cy="30" fill="#121212" r="3"></circle>
  <circle cx="330" cy="30" fill="#121212" r="3"></circle>
  <circle cx="360" cy="30" fill="#121212" r="3"></circle>
  <circle cx="390" cy="30" fill="#121212" r="3"></circle>
  <circle cx="420" cy="30" fill="#121212" r="3"></circle>
  <circle cx="450" cy="30" fill="#121212" r="3"></circle>
  <circle cx="480" cy="30" fill="#121212" r="3"></circle>
  <circle cx="510" cy="30" fill="#121212" r="3"></circle>
  <circle cx="540" cy="30" fill="#121212" r="3"></circle>
  <circle cx="570" cy="30" fill="#121212" r="3"></circle>
</g>
<!-- Lignes de vitesse manga -->
<line class="speed-line" opacity="0.4" x1="50" x2="550" y1="45" y2="45"></line>
<line class="speed-line-dark" opacity="0.3" x1="20" x2="580" y1="95" y2="95"></line>
<line class="speed-line" opacity="0.5" x1="70" x2="530" y1="180" y2="180"></line>
<!-- Ligne de sol -->
<line class="bg-ground-line" x1="20" x2="580" y1="195" y2="195"></line>
<line stroke="#121212" stroke-dasharray="15 10" stroke-width="2" x1="10" x2="590" y1="205" y2="205"></line>

<!-- Onomatopée WAP ! -->
<g transform="translate(470, 35)">
  <polygon fill="#FFE600" points="0,25 -15,40 10,32 30,50 45,28 65,35 60,15 80,0 55,-5 45,-25 25,-10 0,-20 -5,5" stroke="#121212" stroke-linejoin="round" stroke-width="3"></polygon>
  <text fill="#F5222D" font-family="'Impact', 'Arial Black', sans-serif" font-size="16" font-weight="900" text-anchor="middle" transform="rotate(-6 32 16)" x="32" y="16">WAP !</text>
</g>

<!-- Onomatopée TCHÔÔ ! -->
<g transform="translate(110, 45)">
  <polygon fill="#FFFFFF" points="0,20 -12,32 8,26 25,40 38,22 55,28 50,12 68,0 46,-4 38,-20 20,-8 0,-15 -4,4" stroke="#121212" stroke-linejoin="round" stroke-width="3"></polygon>
  <text fill="#121212" font-family="'Impact', 'Arial Black', sans-serif" font-size="14" font-weight="900" text-anchor="middle" transform="rotate(5 28 14)" x="28" y="14">TCHÔÔ !</text>
</g>

<!-- RUNNER 2 : LE POURSUIVANT AVEC LA CHICOTTE -->
<g class="runner-back">
  <!-- Poussière -->
  <g class="dust1" transform="translate(150, 188)">
    <circle cx="0" cy="0" fill="#DCD9D7" r="9" stroke="#121212" stroke-width="2"></circle>
    <circle cx="-12" cy="-4" fill="#DCD9D7" r="6" stroke="#121212" stroke-width="2"></circle>
    <circle cx="-20" cy="2" fill="#DCD9D7" r="4" stroke="#121212" stroke-width="1.5"></circle>
  </g>
  <!-- Jambe arrière -->
  <g class="leg-b2">
    <path d="M 185 148 L 165 178 L 145 188" fill="none" stroke="#121212" stroke-linecap="round" stroke-linejoin="round" stroke-width="11"></path>
    <path d="M 185 148 L 165 178 L 145 188" fill="none" stroke="#F5222D" stroke-linecap="round" stroke-linejoin="round" stroke-width="7"></path>
    <path d="M 145 188 L 132 188 C 130 188 128 194 134 196 L 152 196 Z" fill="#121212"></path>
  </g>
  <!-- Jambe avant -->
  <g class="leg-b1">
    <path d="M 185 148 L 205 176 L 225 188" fill="none" stroke="#121212" stroke-linecap="round" stroke-linejoin="round" stroke-width="11"></path>
    <path d="M 185 148 L 205 176 L 225 188" fill="none" stroke="#F5222D" stroke-linecap="round" stroke-linejoin="round" stroke-width="7"></path>
    <path d="M 225 188 L 242 188 C 246 190 244 196 238 196 L 218 196 Z" fill="#121212"></path>
  </g>
  <!-- Torse rouge -->
  <path d="M 170 108 L 200 115 L 188 155 L 165 148 Z" fill="#F5222D" stroke="#121212" stroke-linejoin="round" stroke-width="4"></path>
  <!-- Ceinture jaune -->
  <line stroke="#FFE600" stroke-width="5" x1="168" x2="190" y1="148" y2="153"></line>
  <rect fill="#121212" height="7" width="6" x="176" y="147"></rect>
  <!-- Bras arrière -->
  <g class="arm-b2">
    <path d="M 178 115 L 150 125 L 130 110" fill="none" stroke="#121212" stroke-linecap="round" stroke-width="8"></path>
    <circle cx="130" cy="110" fill="#8D5524" r="6" stroke="#121212" stroke-width="2"></circle>
  </g>
  <!-- Tête furieuse -->
  <g transform="translate(182, 85)">
    <circle cx="0" cy="0" fill="#8D5524" r="18" stroke="#121212" stroke-width="4"></circle>
    <path d="M -18 -6 C -18 -20 10 -22 22 -8 C 24 -2 18 2 12 0 Z" fill="#121212"></path>
    <polygon fill="#F5222D" points="12,-2 26,-4 22,4"></polygon>
    <!-- Yeux furieux -->
    <ellipse cx="6" cy="-2" fill="#FFFFFF" rx="4" ry="4" stroke="#121212" stroke-width="2"></ellipse>
    <circle cx="8" cy="-2" fill="#121212" r="2"></circle>
    <!-- Dents serrées -->
    <rect fill="#FFFFFF" height="6" rx="2" stroke="#121212" stroke-width="2" width="12" x="2" y="7"></rect>
    <line stroke="#121212" stroke-width="1.5" x1="6" x2="6" y1="7" y2="13"></line>
    <line stroke="#121212" stroke-width="1.5" x1="10" x2="10" y1="7" y2="13"></line>
  </g>
  <!-- Bras avant avec la chicotte qui fouette -->
  <g class="arm-b1">
    <path d="M 195 116 L 218 100 L 235 90" fill="none" stroke="#121212" stroke-linecap="round" stroke-width="9"></path>
    <circle cx="235" cy="90" fill="#8D5524" r="6" stroke="#121212" stroke-width="2"></circle>
    <path class="chappie" d="M 235 90 Q 260 70 280 85" fill="none" stroke="#FFE600" stroke-linecap="round" stroke-width="5"></path>
    <path class="chappie" d="M 235 90 Q 260 70 280 85" fill="none" stroke="#121212" stroke-linecap="round" stroke-width="2"></path>
  </g>
</g>

<!-- RUNNER 1 : LE FUGITIF PANIKÉ -->
<g class="runner-front">
  <!-- Poussière sous les pieds -->
  <g class="dust2" transform="translate(360, 188)">
    <circle cx="0" cy="0" fill="#DCD9D7" r="10" stroke="#121212" stroke-width="2"></circle>
    <circle cx="-14" cy="-5" fill="#DCD9D7" r="7" stroke="#121212" stroke-width="2"></circle>
    <circle cx="-25" cy="1" fill="#DCD9D7" r="5" stroke="#121212" stroke-width="1.5"></circle>
  </g>
  <!-- Jambe bleue arrière -->
  <g class="leg-f2">
    <path d="M 390 148 L 415 172 L 440 188" fill="none" stroke="#121212" stroke-linecap="round" stroke-linejoin="round" stroke-width="11"></path>
    <path d="M 390 148 L 415 172 L 440 188" fill="none" stroke="#2563EB" stroke-linecap="round" stroke-linejoin="round" stroke-width="7"></path>
    <path d="M 440 188 L 458 188 C 462 190 460 196 454 196 L 434 196 Z" fill="#FFE600" stroke="#121212" stroke-width="2"></path>
  </g>
  <!-- Jambe bleue avant -->
  <g class="leg-f1">
    <path d="M 390 148 L 365 174 L 340 188" fill="none" stroke="#121212" stroke-linecap="round" stroke-linejoin="round" stroke-width="11"></path>
    <path d="M 390 148 L 365 174 L 340 188" fill="none" stroke="#2563EB" stroke-linecap="round" stroke-linejoin="round" stroke-width="7"></path>
    <path d="M 340 188 L 324 188 C 320 188 322 194 328 196 L 348 196 Z" fill="#FFE600" stroke="#121212" stroke-width="2"></path>
  </g>
  <!-- Torse vert penché en avant de panique -->
  <path d="M 370 110 L 405 112 L 398 152 L 375 150 Z" fill="#00B050" stroke="#121212" stroke-linejoin="round" stroke-width="4"></path>
  <!-- Bras arrière affolé -->
  <g class="arm-f2">
    <path d="M 378 116 L 350 102 L 335 115" fill="none" stroke="#121212" stroke-linecap="round" stroke-width="8"></path>
    <circle cx="335" cy="115" fill="#C68642" r="6" stroke="#121212" stroke-width="2"></circle>
    <rect fill="#FFE600" height="12" stroke="#121212" stroke-width="2" transform="rotate(18 323 114)" width="16" x="315" y="108"></rect>
  </g>
  <!-- Tête paniquée et yeux braqués en arrière -->
  <g transform="translate(398, 82)">
    <circle cx="0" cy="0" fill="#C68642" r="19" stroke="#121212" stroke-width="4"></circle>
    <!-- Gros yeux de panique -->
    <ellipse cx="-6" cy="-2" fill="#FFFFFF" rx="6" ry="7" stroke="#121212" stroke-width="2.5"></ellipse>
    <ellipse cx="6" cy="-2" fill="#FFFFFF" rx="6" ry="7" stroke="#121212" stroke-width="2.5"></ellipse>
    <!-- Pupilles regardant vers l'arrière d'effroi -->
    <circle cx="-9" cy="-2" fill="#121212" r="2.5"></circle>
    <circle cx="3" cy="-2" fill="#121212" r="2.5"></circle>
    <!-- Bouche grande ouverte en cri -->
    <ellipse cx="3" cy="9" fill="#990000" rx="7" ry="5" stroke="#121212" stroke-width="2"></ellipse>
    <path d="M -2 7 Q 3 10 8 7" fill="#FFFFFF"></path>
    <!-- Cheveux afro style BD -->
    <circle cx="-14" cy="-10" fill="#121212" r="6"></circle>
    <circle cx="-8" cy="-16" fill="#121212" r="7"></circle>
    <circle cx="2" cy="-18" fill="#121212" r="7"></circle>
    <circle cx="12" cy="-14" fill="#121212" r="6"></circle>
    <circle cx="17" cy="-7" fill="#121212" r="5"></circle>
  </g>
  <!-- Grosses gouttes de sueur explosives -->
  <g class="sweat" transform="translate(390, 65)">
    <path d="M 0 0 C -4 -4 -6 -10 0 -14 C 6 -10 4 -4 0 0 Z" fill="#00C0FF" stroke="#121212" stroke-width="2"></path>
  </g>
  <g class="sweat" transform="translate(425, 60)">
    <path d="M 0 0 C 4 -4 6 -10 0 -14 C -6 -10 -4 -4 0 0 Z" fill="#00C0FF" stroke="#121212" stroke-width="2"></path>
  </g>
  <!-- Bras avant tendu vers l'avant -->
  <g class="arm-f1">
    <path d="M 400 116 L 428 108 L 448 95" fill="none" stroke="#121212" stroke-linecap="round" stroke-width="9"></path>
    <circle cx="448" cy="95" fill="#C68642" r="6" stroke="#121212" stroke-width="2"></circle>
    <line stroke="#121212" stroke-linecap="round" stroke-width="2.5" x1="450" x2="458" y1="92" y2="86"></line>
    <line stroke="#121212" stroke-linecap="round" stroke-width="2.5" x1="452" x2="461" y1="95" y2="93"></line>
    <line stroke="#121212" stroke-linecap="round" stroke-width="2.5" x1="450" x2="458" y1="98" y2="102"></line>
  </g>
</g>

<!-- Cartouche "SAUVE QUI PEUT !" en haut à gauche -->
<g transform="translate(18, 16)">
  <rect fill="#121212" height="24" rx="4" width="130" x="0" y="0"></rect>
  <text fill="#FFFFFF" font-family="'Impact', 'Arial Black', sans-serif" font-size="12" letter-spacing="1" text-anchor="middle" x="65" y="16">SAUVE QUI PEUT !</text>
</g>
</svg>
`;

export const AnimatedChaseScene: React.FC = () => {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <div
          style={{ width: '100%', height: '100%', display: 'flex' }}
          dangerouslySetInnerHTML={{ __html: SVG_ANIMATED_CONTENT }}
        />
      </View>
    );
  }

  // Fallback pour mobile natif
  return (
    <View style={styles.container}>
      <View style={styles.nativeFallback}>
        {/* Rendu de secours avec cadre stylisé */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 210,
    backgroundColor: '#FCF9F6',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#171416',
    overflow: 'hidden',
    shadowColor: '#171416',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  nativeFallback: {
    flex: 1,
    backgroundColor: '#FCF9F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
