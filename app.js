const { useState, useEffect, useRef, useCallback } = React;

// ── THEME ─────────────────────────────────────────────────────────────────────
const T = {
  bg:       "#f5f0e8", bgDeep: "#ede7d9", surface: "#faf7f2",
  border:   "#d9d0be", ink: "#2b2318", inkMid: "#4a3f2f", inkLight: "#9a8c78",
  sage:     "#4a6741", sageSoft: "#d4e3d0",
  clay:     "#8b4a2e", claySoft: "#f0ddd6",
  blue:     "#2c4a72", blueSoft: "#dae3f0",
  gold:     "#7a5c1e", goldSoft: "#f5edda",
  font:     "'Lexend', sans-serif",
};

// ── GLOSSARY ──────────────────────────────────────────────────────────────────
const GLOSSARY = {
  "phospholipid":      { cat: "Cell Biology",    def: "A molecule with a hydrophilic phosphate head and two hydrophobic fatty acid tails. The building block of all cell membranes. Spontaneously forms bilayers in water." },
  "phospholipids":     { cat: "Cell Biology",    def: "Plural of phospholipid. The molecules that form the cell membrane bilayer — hydrophilic heads face outward, hydrophobic tails hide inward." },
  "phospholipid bilayer": { cat: "Cell Biology", def: "Two sheets of phospholipids arranged tail-to-tail. The fundamental structure of all cell membranes. Created spontaneously in water by thermodynamics." },
  "bilayer":           { cat: "Cell Biology",    def: "Two sheets of phospholipids arranged tail-to-tail. The basic structure of the cell membrane." },
  "hydrophilic":       { cat: "Chemistry",       def: "Water-loving. A molecule or region that dissolves in or is attracted to water. From Greek: hydro (water) + philos (loving). Opposite of hydrophobic." },
  "hydrophobic":       { cat: "Chemistry",       def: "Water-fearing. A molecule or region that repels water and doesn't dissolve in it. From Greek: hydro (water) + phobos (fear). Opposite of hydrophilic." },
  "prokaryote":        { cat: "Cell Biology",    def: "A cell without a membrane-bound nucleus. DNA floats free in the cytoplasm as a single circular chromosome. Has 70S ribosomes. All bacteria are prokaryotes." },
  "prokaryotes":       { cat: "Cell Biology",    def: "Cells without a membrane-bound nucleus. DNA floats free in the cytoplasm. Have 70S ribosomes (30S + 50S). All bacteria are prokaryotes." },
  "eukaryote":         { cat: "Cell Biology",    def: "A cell with a membrane-bound nucleus, linear chromosomes, and specialized organelles. Has 80S ribosomes (40S + 60S). All human cells are eukaryotes." },
  "eukaryotes":        { cat: "Cell Biology",    def: "Cells with a membrane-bound nucleus and specialized organelles. Have 80S ribosomes. All human cells are eukaryotes." },
  "ribosome":          { cat: "Cell Biology",    def: "The molecular machine that translates mRNA into protein. Bacteria have 70S ribosomes (30S + 50S); eukaryotes have 80S (40S + 60S). This structural difference is exploited by antibiotics." },
  "ribosomes":         { cat: "Cell Biology",    def: "Molecular machines that translate mRNA into protein. Bacteria: 70S (30S + 50S). Eukaryotes: 80S (40S + 60S). Mitochondria also have 70S ribosomes." },
  "cytoplasm":         { cat: "Cell Biology",    def: "The fluid-filled interior of a cell, excluding the nucleus. Contains organelles, ribosomes, and dissolved molecules. In prokaryotes, DNA floats free here." },
  "mitochondria":      { cat: "Cell Biology",    def: "Double-membrane organelles that generate ATP via oxidative phosphorylation. Have their own circular DNA and 70S ribosomes, supporting the Endosymbiotic Theory. Initiate intrinsic apoptosis." },
  "mitochondrion":     { cat: "Cell Biology",    def: "Singular of mitochondria. A double-membrane organelle that generates ATP. Has its own circular DNA and 70S ribosomes — was once a free-living bacterium." },
  "nucleus":           { cat: "Cell Biology",    def: "The membrane-bound organelle that houses the cell's DNA. Found in eukaryotes. Bounded by a double membrane (nuclear envelope) with nuclear pores for regulating traffic." },
  "organelle":         { cat: "Cell Biology",    def: "A membrane-bound compartment within a eukaryotic cell with a specific function. Examples: nucleus, mitochondria, Golgi apparatus, endoplasmic reticulum, lysosomes." },
  "organelles":        { cat: "Cell Biology",    def: "Membrane-bound compartments within eukaryotic cells, each with a specific function. Examples: nucleus (DNA storage), mitochondria (ATP), Golgi (protein processing), lysosomes (digestion)." },
  "apoptosis":         { cat: "Pathology",       def: "Programmed cell death — an orderly, energy-dependent process. Two pathways: intrinsic (mitochondrial, triggered by DNA damage) and extrinsic (death receptor). Phosphatidylserine flips to outer leaflet as the 'eat me' signal for macrophages. Distinct from necrosis (uncontrolled death)." },
  "phosphatidylserine":{ cat: "Cell Biology",    def: "A phospholipid normally on the inner leaflet of the cell membrane. During apoptosis, it flips to the outer leaflet — this is the 'eat me' signal recognized by macrophage receptors. Directly tested on Step 1." },
  "macrophage":        { cat: "Immunology",      def: "A large phagocytic immune cell. Engulfs and destroys pathogens, dead cells, and debris. Recognizes phosphatidylserine on apoptotic cells. Derived from monocytes in the blood." },
  "macrophages":       { cat: "Immunology",      def: "Large phagocytic immune cells that engulf pathogens, dead cells, and debris. Recognize phosphatidylserine on apoptotic cells and clear them without triggering inflammation." },
  "osmosis":           { cat: "Physiology",      def: "Movement of water across a semipermeable membrane from low solute concentration to high solute concentration. Water chases solutes it cannot follow. Osmotic pressure is the force required to stop this flow." },
  "osmolarity":        { cat: "Physiology",      def: "The concentration of solutes in a solution, measured in mOsm/L. Higher osmolarity = stronger pull on water. Normal serum osmolarity: ~285-295 mOsm/kg." },
  "aquaporin":         { cat: "Physiology",      def: "A protein channel perfectly selective for water. Allows rapid water movement across membranes. AQP2 is the key one — in kidney collecting duct, inserted by ADH. Without ADH, no AQP2, no water reabsorption." },
  "aquaporins":        { cat: "Physiology",      def: "Protein channels that allow rapid, selective water transport across membranes. AQP2 is the most tested: lives in kidney collecting duct, inserted into membrane by ADH to concentrate urine." },
  "ADH":               { cat: "Physiology",      def: "Antidiuretic hormone (vasopressin). Released from posterior pituitary when blood osmolarity rises. Acts on kidney collecting duct to insert AQP2 channels → water reabsorbed → urine concentrates. Absent in Central DI; ineffective in Nephrogenic DI." },
  "vasopressin":       { cat: "Physiology",      def: "Another name for ADH (antidiuretic hormone). Released from posterior pituitary when dehydrated. Inserts AQP2 water channels into kidney collecting duct → water reabsorbed → urine concentrates." },
  "hyponatremia":      { cat: "Clinical Med",    def: "Low blood sodium (Na⁺ < 135 mEq/L). Brain cells swell (water moves in). Causes: SIADH, heart failure, cirrhosis, hypothyroidism. Correct slowly — no faster than 8-10 mEq/L/24hr or risk osmotic demyelination." },
  "hypernatremia":     { cat: "Clinical Med",    def: "High blood sodium (Na⁺ > 145 mEq/L). Brain cells shrink (water moves out). Causes: Diabetes Insipidus, inadequate water intake, excess Na⁺. Treat with hypotonic fluids (D5W, 0.45% NaCl)." },
  "SIADH":             { cat: "Clinical Med",    def: "Syndrome of Inappropriate ADH. Excess ADH causes the kidney to reabsorb too much water → blood dilutes → hyponatremia + concentrated urine despite low serum osmolarity. Causes: SCLC (ectopic ADH), CNS injury, carbamazepine, SSRIs." },
  "diabetes insipidus":{ cat: "Clinical Med",    def: "Inability to concentrate urine due to absent (Central DI — no ADH) or non-functional (Nephrogenic DI — kidney doesn't respond to ADH) AQP2. Presents with massive dilute urine (polyuria) and hypernatremia." },
  "isotonic":          { cat: "Physiology",      def: "A solution with the same solute concentration as the cell interior. No net water movement. Cell size unchanged. Examples: 0.9% NaCl (normal saline), Lactated Ringer's. Used for volume replacement." },
  "hypertonic":        { cat: "Physiology",      def: "A solution with higher solute concentration than the cell. Water moves OUT of cells → cells shrink. Example: 3% NaCl. Used to treat cerebral edema and severe hyponatremia." },
  "hypotonic":         { cat: "Physiology",      def: "A solution with lower solute concentration than the cell. Water moves INTO cells → cells swell. Example: D5W (after glucose is metabolized). Used to treat hypernatremia." },
  "active transport":  { cat: "Cell Biology",    def: "Movement of molecules against their concentration gradient, requiring energy. Primary active transport uses ATP directly (e.g., Na⁺/K⁺-ATPase). Secondary active transport uses ion gradients created by primary transport (e.g., SGLT transporters)." },
  "passive diffusion": { cat: "Cell Biology",    def: "Movement of molecules down their concentration gradient without energy or transporters. Small nonpolar molecules (O₂, CO₂, steroid hormones) cross this way. Rate follows Fick's Law." },
  "facilitated diffusion": { cat: "Cell Biology", def: "Movement of molecules down their concentration gradient via a protein channel or carrier. No energy required. Example: GLUT transporters moving glucose. Cannot move molecules against their gradient." },
  "diffusion":         { cat: "Cell Biology",    def: "Net movement of molecules from high to low concentration. Passive — no energy required. Continues until equilibrium. Rate depends on concentration gradient, membrane permeability, and molecule size/charge." },
  "Na⁺/K⁺-ATPase":    { cat: "Cell Biology",    def: "The sodium-potassium pump. Uses 1 ATP to pump 3 Na⁺ OUT and 2 K⁺ IN. Maintains the ion gradients essential for nerve impulses, muscle contraction, and nutrient absorption. Target of digoxin." },
  "digoxin":           { cat: "Pharmacology",    def: "A cardiac glycoside that inhibits the Na⁺/K⁺-ATPase. Mechanism: ↑intracellular Na⁺ → Na⁺/Ca²⁺ exchanger loses driving force → ↑intracellular Ca²⁺ → stronger cardiac contraction (positive inotropy). Used in heart failure and atrial fibrillation." },
  "GLUT":              { cat: "Physiology",      def: "Glucose Transporter. A family of carrier proteins that move glucose by facilitated diffusion (no energy, with gradient). Key types: GLUT1 (brain/RBCs, always on), GLUT2 (glucose sensor in β-cells/liver), GLUT3 (neurons), GLUT4 (muscle/fat, insulin-dependent)." },
  "SGLT":              { cat: "Physiology",      def: "Sodium-Glucose Linked Transporter. Uses the Na⁺ gradient (built by Na⁺/K⁺-ATPase) to co-transport glucose and Na⁺ into cells. SGLT1: intestinal absorption. SGLT2: kidney reabsorption — target of gliflozin drugs." },
  "insulin":           { cat: "Endocrinology",   def: "A peptide hormone from pancreatic β-cells released when blood glucose rises. Key action: causes GLUT4 translocation to the surface of muscle and fat cells → glucose uptake → blood glucose falls. Deficient/dysfunctional in diabetes." },
  "ATP":               { cat: "Biochemistry",    def: "Adenosine Triphosphate. The cell's primary energy currency. Generated by glycolysis (2 ATP/glucose), TCA cycle (NADH/FADH₂), and oxidative phosphorylation (~30-32 ATP/glucose). Hydrolysis of ATP → ADP + Pᵢ releases energy." },
  "cholesterol":       { cat: "Biochemistry",    def: "A sterol lipid found in cell membranes. At body temperature, it reduces membrane fluidity by filling gaps between phospholipids. Precursor to steroid hormones (cortisol, estrogen, testosterone) and bile acids. Synthesized by HMG-CoA reductase (statin target)." },
  "endosymbiotic theory":{ cat: "Cell Biology",  def: "The theory that mitochondria and chloroplasts were once free-living prokaryotes engulfed by an ancestral eukaryotic cell. Evidence: both have circular DNA, 70S ribosomes, and divide by binary fission." },
  "aminoglycoside":    { cat: "Pharmacology",    def: "A class of antibiotics (gentamicin, streptomycin, tobramycin, amikacin) that bind the bacterial 30S ribosomal subunit, causing misreading of mRNA → garbled proteins → bacterial death. Nephrotoxic and ototoxic." },
  "aminoglycosides":   { cat: "Pharmacology",    def: "Antibiotics that bind the bacterial 30S ribosomal subunit, causing misreading of mRNA. Examples: gentamicin, tobramycin, amikacin. Side effects: nephrotoxicity, ototoxicity. Do not target human 80S ribosomes." },
  "chloramphenicol":   { cat: "Pharmacology",    def: "An antibiotic that inhibits the 50S ribosomal subunit (bacterial and mitochondrial). Can cause aplastic anemia (bone marrow suppression) because rapidly dividing marrow cells are vulnerable to mitochondrial ribosome inhibition. Reserved for serious infections." },
  "BCL-2":             { cat: "Molecular Bio",   def: "An anti-apoptotic protein on the outer mitochondrial membrane. Normally prevents BAX/BAK from releasing cytochrome c. Overexpressed in follicular lymphoma (t(14;18) translocation). Target of venetoclax." },
  "cytochrome c":      { cat: "Biochemistry",    def: "A protein normally in the mitochondrial intermembrane space. When released into the cytoplasm by BAX/BAK (during intrinsic apoptosis), it combines with APAF-1 and dATP to form the apoptosome → activates caspase-9 → cell death." },
  "caspase":           { cat: "Molecular Bio",   def: "Cysteine proteases that execute apoptosis. Initiator caspases (8, 9) activate effector caspases (3, 6, 7) which cleave cellular proteins. Caspase-9 is activated by the apoptosome in the intrinsic pathway." },
  "microvilli":        { cat: "Cell Biology",    def: "Finger-like projections on the apical surface of epithelial cells (especially intestinal). Formed by actin microfilaments. Dramatically increase surface area for absorption. Collectively called the 'brush border.'" },
  "bile":              { cat: "GI Physiology",   def: "A digestive fluid produced by the liver and stored in the gallbladder. Contains bile salts (from cholesterol), bilirubin, cholesterol, and phospholipids. Released into the duodenum to emulsify dietary fats for digestion." },
  "bile salts":        { cat: "GI Physiology",   def: "Amphipathic molecules derived from cholesterol in the liver. Emulsify dietary fat in the duodenum (break large globules into tiny droplets) and form micelles to ferry fatty acids/monoglycerides to intestinal cells for absorption." },
  "chylomicron":       { cat: "Biochemistry",    def: "A large lipoprotein assembled in intestinal epithelial cells after fat absorption. Contains triglycerides, cholesterol, phospholipids, and apolipoprotein B-48. Too large for capillaries — enters lymphatics (lacteals) → thoracic duct → bloodstream." },
  "chylomicrons":      { cat: "Biochemistry",    def: "Large lipoproteins made in intestinal cells after fat digestion. Carry dietary triglycerides, cholesterol, and fat-soluble vitamins. Enter lymphatics (lacteals) and reach blood via the thoracic duct. Not filtered through portal circulation." },
  "micelle":           { cat: "GI Physiology",   def: "A small spherical structure formed by bile salts surrounding fatty acids and monoglycerides. Hydrophilic shell with hydrophobic core. Carries fat-digestion products to intestinal brush border for absorption. Fat-soluble vitamins travel in micelles." },
  "micelles":          { cat: "GI Physiology",   def: "Tiny spherical carriers formed by bile salts surrounding fatty acids and monoglycerides after lipid digestion. Transport hydrophobic molecules to intestinal cells for absorption. Disrupted by absent bile (cholestasis) or absent lipase (CF, pancreatitis)." },
  "first-pass effect": { cat: "Pharmacology",    def: "The phenomenon where a drug absorbed from the intestine travels via the portal vein to the liver before reaching systemic circulation. Hepatic CYP450 enzymes metabolize a fraction of the drug — reducing bioavailability. Explains why nitroglycerin must be sublingual." },
  "CYP450":            { cat: "Pharmacology",    def: "Cytochrome P450 enzymes. Located in hepatocytes (mainly) and intestinal epithelium. Metabolize drugs and toxins. Subject to induction (e.g., rifampin speeds metabolism) and inhibition (e.g., grapefruit juice slows metabolism)." },
  "nitroglycerin":     { cat: "Pharmacology",    def: "A nitrate drug that donates nitric oxide → vasodilation → reduced cardiac preload and afterload → relief of angina. Almost completely destroyed by hepatic first-pass metabolism if swallowed. Given sublingually, transdermally, or IV." },
  "linezolid":         { cat: "Pharmacology",    def: "An oxazolidinone antibiotic that inhibits bacterial 50S ribosomal subunit. Used for MRSA and VRE. Risk of bone marrow suppression with prolonged use due to mitochondrial 70S ribosome inhibition. Also a weak MAO inhibitor." },
  "osmotic demyelination": { cat: "Clinical Med", def: "Also called central pontine myelinolysis. Destruction of myelin sheaths in the brainstem caused by overly rapid correction of hyponatremia. Brain cells adapted to low sodium; rapid shift causes osmotic stress and myelin damage. Presents with quadriplegia, dysarthria, dysphagia. Irreversible." },
  "endoplasmic reticulum": { cat: "Cell Biology", def: "A network of membranes continuous with the nuclear envelope. Rough ER (studded with ribosomes): synthesizes and processes secretory/membrane proteins. Smooth ER: synthesizes lipids and steroid hormones, metabolizes drugs (CYP450), sequesters Ca²⁺." },
  "Golgi apparatus":   { cat: "Cell Biology",    def: "The cell's 'post office.' Receives proteins from rough ER, adds O-linked glycosylation, performs proteolytic cleavage, and sorts proteins to their destinations (lysosomes, cell surface, secretion). Adds mannose-6-phosphate tags to lysosomal proteins." },
  "lysosome":          { cat: "Cell Biology",    def: "A membrane-bound organelle containing ~60 hydrolytic enzymes (acid hydrolases) at pH ~4.8. Degrades cellular debris, foreign material, and worn organelles. Enzymes delivered via mannose-6-phosphate tagging in the Golgi. Defects cause lysosomal storage diseases." },
  "lysosomes":         { cat: "Cell Biology",    def: "Membrane-bound organelles filled with acid hydrolases (pH ~4.8). Digest cellular debris, pathogens, and organelles. Require mannose-6-phosphate tagging in Golgi to receive enzymes. Defects cause lysosomal storage diseases (Gaucher, Tay-Sachs, etc.)." },
  "DNA":               { cat: "Molecular Bio",   def: "Deoxyribonucleic acid. The molecule that stores genetic information. Double helix of nucleotides (adenine-thymine, guanine-cytosine base pairs). In prokaryotes: circular, in cytoplasm. In eukaryotes: linear, in nucleus, wound around histones." },
  "RNA":               { cat: "Molecular Bio",   def: "Ribonucleic acid. Single-stranded nucleic acid. Types: mRNA (messenger, carries genetic code), tRNA (transfer, carries amino acids), rRNA (ribosomal, structural component of ribosomes). Uses uracil instead of thymine." },
  "chromosome":        { cat: "Molecular Bio",   def: "A organized structure of DNA and proteins (histones). Prokaryotes: one circular chromosome. Eukaryotes: multiple linear chromosomes. Humans have 46 chromosomes (23 pairs). Condense during cell division for equal distribution to daughter cells." },
  "cytoskeleton":      { cat: "Cell Biology",    def: "The internal structural framework of cells. Three components: microfilaments (actin, 7nm), intermediate filaments (tissue-specific, 8-12nm), microtubules (tubulin, 25nm). Maintains cell shape, enables movement, organizes organelles." },
  "actin":             { cat: "Cell Biology",    def: "A protein that polymerizes into microfilaments (F-actin). Forms the cell cortex, contractile ring during cytokinesis, and microvilli. Inhibited by cytochalasin B. Works with myosin to produce cellular movement and muscle contraction." },
  "microtubule":       { cat: "Cell Biology",    def: "Hollow tubes of α/β-tubulin dimers (25nm). Form the mitotic spindle (chromosome separation), transport highways (kinesins/dyneins), and cilia/flagella axoneme. Stabilized by taxol; polymerization inhibited by colchicine and vinca alkaloids." },
  "microtubules":      { cat: "Cell Biology",    def: "Hollow tubes built from α/β-tubulin dimers. Form the mitotic spindle, intracellular transport highways, cilia, and flagella. Taxol stabilizes them (cancer drug). Colchicine and vincristine block polymerization." },
  "osmotic pressure":  { cat: "Physiology",      def: "The pressure required to stop osmosis — the flow of water across a semipermeable membrane. Proportional to solute concentration. High osmolarity = high osmotic pressure = strong pull on water." },
  "glucose":           { cat: "Biochemistry",    def: "A 6-carbon monosaccharide. The primary fuel for most cells. Transported by GLUT family (facilitated diffusion) and SGLT family (active transport). Metabolized by glycolysis → pyruvate → TCA cycle → ~30-32 ATP per molecule." },
  "fatty acid":        { cat: "Biochemistry",    def: "A carboxylic acid with a long hydrocarbon chain. Saturated (no double bonds, straight, pack tightly) vs unsaturated (double bonds, kinked, more fluid). Key energy storage molecules. Undergo β-oxidation in mitochondria to generate acetyl-CoA." },
  "fatty acids":       { cat: "Biochemistry",    def: "Carboxylic acids with long hydrocarbon chains. Saturated (straight, pack tightly → rigid membrane) vs unsaturated (kinked → fluid membrane). Main energy storage. Released from triglycerides by lipase during fat digestion." },
  "triglyceride":      { cat: "Biochemistry",    def: "Three fatty acids esterified to a glycerol backbone. The main form of dietary fat and energy storage. Digested by pancreatic lipase into monoglycerides + free fatty acids. Packaged into chylomicrons for transport." },
  "triglycerides":     { cat: "Biochemistry",    def: "Three fatty acids esterified to glycerol. Main form of fat storage and dietary fat. Cleaved by pancreatic lipase during digestion. Cannot be directly absorbed — must be broken down into monoglycerides and fatty acids first." },
  "peroxisome":        { cat: "Cell Biology",    def: "An organelle containing oxidative enzymes (catalase, peroxidase). Breaks down very long-chain fatty acids (beta-oxidation) and destroys H₂O₂ (→ H₂O + O₂). Absent/dysfunctional in Zellweger syndrome → severe neurological disease from VLCFA accumulation." },
  "peroxisomes":       { cat: "Cell Biology",    def: "Organelles containing oxidative enzymes. Perform beta-oxidation of very long-chain fatty acids and break down toxic H₂O₂. Defective in Zellweger syndrome." },
  "smooth ER":         { cat: "Cell Biology",    def: "Endoplasmic reticulum without ribosomes. Functions: lipid and steroid hormone synthesis, CYP450 drug metabolism, Ca²⁺ storage (muscle SR releases Ca²⁺ for contraction), detoxification. Abundant in hepatocytes and steroid-producing cells." },
  "rough ER":          { cat: "Cell Biology",    def: "Endoplasmic reticulum studded with ribosomes. Synthesizes secretory proteins, membrane proteins, and proteins destined for organelles. Adds N-linked glycosylation. Products move to Golgi for further processing." },
  "sarcoplasmic reticulum": { cat: "Physiology", def: "Specialized smooth ER in muscle cells. Stores and releases Ca²⁺. During contraction, an action potential triggers Ca²⁺ release → Ca²⁺ binds troponin C → myosin-actin cross-bridge → contraction. Ca²⁺ is pumped back in by SERCA." },
  "proteasome":        { cat: "Cell Biology",    def: "The cell's protein recycling machine — a barrel-shaped complex that degrades ubiquitin-tagged proteins. Removes misfolded, damaged, and regulatory proteins (cyclins, transcription factors). Inhibited by bortezomib (multiple myeloma treatment)." },
  "ubiquitin":         { cat: "Molecular Bio",   def: "A small protein tag added to proteins destined for destruction. Polyubiquitination targets proteins to the 26S proteasome for degradation. The ubiquitin-proteasome system regulates the cell cycle, immune responses, and protein quality control." },
  "cilia":             { cat: "Cell Biology",    def: "Hair-like projections built on a 9+2 microtubule axoneme, powered by dynein ATPase. Move mucus in airways, eggs in fallopian tubes, and CSF. Defective dynein → Kartagener syndrome (situs inversus, bronchiectasis, infertility)." },
  "dynein":            { cat: "Cell Biology",    def: "Motor protein moving toward microtubule minus ends (retrograde transport). Powers cilia and flagella. Defective in Kartagener syndrome (primary ciliary dyskinesia) → immotile cilia and sperm." },
  "kinesin":           { cat: "Cell Biology",    def: "Motor protein moving toward microtubule plus ends (anterograde transport — nucleus to periphery). Carries vesicles and organelles. Taxanes stabilize microtubules and impair kinesin-dependent transport." },
  "nuclear envelope":  { cat: "Cell Biology",    def: "The double membrane surrounding the nucleus, continuous with the rough ER. Contains nuclear pores that regulate traffic: mRNA and ribosome subunits exit; transcription factors and histones enter (guided by nuclear localization signals)." },
  "lysosomal storage disease": { cat: "Pathology", def: "Diseases from lysosomal enzyme deficiencies → substrate accumulation → cell dysfunction. Examples: Gaucher (glucocerebrosidase), Tay-Sachs (hexosaminidase A), Niemann-Pick (sphingomyelinase), Fabry (α-galactosidase A)." },
  "Gaucher disease":   { cat: "Pathology",       def: "Most common lysosomal storage disease. Glucocerebrosidase deficiency → glucocerebroside accumulates in macrophages. 'Crinkled tissue paper' cytoplasm. Splenomegaly, bone pain, pancytopenia. Treatment: enzyme replacement (imiglucerase)." },
  "Tay-Sachs disease": { cat: "Pathology",       def: "Hexosaminidase A deficiency → GM2 ganglioside accumulates in neurons. Cherry-red macular spot. Progressive neurodegeneration in infants, fatal by age 3-5. Common in Ashkenazi Jews. No treatment." },
  "mannose-6-phosphate":{ cat: "Cell Biology",   def: "The molecular 'zip code' tag added to lysosomal enzymes in the Golgi. The M6P receptor routes tagged enzymes to lysosomes. Without M6P (as in I-cell disease), enzymes are secreted extracellularly instead." },
  "I-cell disease":    { cat: "Pathology",       def: "Mucolipidosis II. GlcNAc phosphotransferase deficiency → lysosomal enzymes lack M6P tags → secreted extracellularly → lysosomes fill with undigested material. High plasma lysosomal enzymes is diagnostic. Severe and fatal." },
  "SERCA":             { cat: "Physiology",      def: "Sarco/Endoplasmic Reticulum Ca²⁺-ATPase. Pumps Ca²⁺ back into SR after muscle contraction using ATP. Inhibited by phospholamban in cardiac muscle (reduced in heart failure)." },
  "vesicle":           { cat: "Cell Biology",    def: "A membrane-bound sphere transporting proteins between organelles. COP II: ER → Golgi. COP I: Golgi → ER (retrieval). Clathrin-coated: endocytosis and Golgi → endosomes. SNAREs mediate docking and fusion." },
  "endocytosis":       { cat: "Cell Biology",    def: "Bringing material into the cell via membrane vesicles. Receptor-mediated (clathrin-coated pits): LDL, transferrin. Phagocytosis: large particles (bacteria, dead cells). Pinocytosis: fluid and small molecules." },
  "exocytosis":        { cat: "Cell Biology",    def: "Releasing vesicle contents extracellularly by fusing with the plasma membrane. Constitutive (continuous): mucus, ECM proteins. Regulated (Ca²⁺-triggered): neurotransmitters, hormones, digestive enzymes." },
  "autophagy":         { cat: "Cell Biology",    def: "The cell's self-digestion process. Damaged organelles and misfolded proteins are enclosed in an autophagosome (double membrane) → fuses with lysosome → degraded. Upregulated during starvation. Dysregulated in neurodegeneration and cancer." },
  "endosome":          { cat: "Cell Biology",    def: "A sorting compartment for endocytosed material. Early endosomes mature into late endosomes → fuse with lysosomes for degradation. Some receptors (transferrin receptor) are recycled back to the plasma membrane. Maintained at low pH by proton pumps." },
  "signal sequence":   { cat: "Molecular Bio",   def: "An N-terminal amino acid sequence directing a newly synthesized protein to its destination. Secretory/membrane proteins: signal sequence → rough ER (co-translational). Nuclear proteins: nuclear localization signal (NLS) → nuclear pore." },
  "receptor":          { cat: "Pharmacology",    def: "A protein that binds a specific molecule (ligand) and produces a cellular response. Surface receptors (GPCRs, RTKs, ion channels) respond to water-soluble signals like hormones and neurotransmitters. Nuclear receptors respond to lipid-soluble signals like steroid hormones." },
  "ligand":            { cat: "Pharmacology",    def: "Any molecule that binds to a receptor. Includes hormones, neurotransmitters, drugs, and growth factors. Binding changes the receptor's shape, triggering a cellular response. Agonists activate the receptor; antagonists block it without activating." },
  "second messenger":  { cat: "Physiology",      def: "An intracellular signaling molecule produced in response to a surface receptor being activated. Relays the signal from the membrane into the cell. Key examples: cAMP (activated by Gs proteins), IP3 and DAG (activated by Gq proteins), cGMP (activated by NO and ANP)." },
  "cAMP":              { cat: "Biochemistry",    def: "Cyclic AMP. A second messenger produced by adenylyl cyclase when a Gs-coupled receptor is activated. Activates Protein Kinase A (PKA), which phosphorylates target proteins. Degraded by phosphodiesterase (PDE). Raised by epinephrine (β receptors), glucagon, TSH, FSH, LH, ACTH, CRH." },
  "adenylyl cyclase":  { cat: "Biochemistry",    def: "An enzyme in the plasma membrane that converts ATP → cAMP. Activated by Gs-coupled GPCRs (via Gsα subunit). Inhibited by Gi-coupled GPCRs. Produces cAMP → activates PKA → phosphorylates downstream targets." },
  "GPCR":              { cat: "Physiology",      def: "G protein-coupled receptor. A 7-transmembrane receptor that signals through heterotrimeric G proteins (Gα, Gβ, Gγ). Types: Gs (stimulates adenylyl cyclase → ↑cAMP), Gi (inhibits adenylyl cyclase → ↓cAMP), Gq (activates PLC → IP3 + DAG → ↑Ca²⁺ + PKC). The most common receptor type in the body." },
  "G protein":         { cat: "Physiology",      def: "A GTP-binding protein that couples receptors to intracellular enzymes. Three subunits: Gα (binds GTP/GDP, has GTPase activity), Gβ, Gγ. When receptor activates, Gα exchanges GDP for GTP and dissociates to activate effectors. Gs stimulates, Gi inhibits, Gq activates PLC." },
  "PKA":               { cat: "Biochemistry",    def: "Protein Kinase A (cAMP-dependent protein kinase). Activated by cAMP. Phosphorylates serine/threonine residues on target proteins — activating some, inhibiting others. Mediates effects of epinephrine (fight-or-flight), glucagon (glycogen breakdown), and many hormones." },
  "PKC":               { cat: "Biochemistry",    def: "Protein Kinase C. Activated by DAG (from PLC/Gq pathway) together with Ca²⁺. Phosphorylates many cellular targets involved in cell growth, inflammation, and metabolism. Overactivated by phorbol esters (tumor promoters)." },
  "IP3":               { cat: "Biochemistry",    def: "Inositol trisphosphate. A second messenger produced when PLC cleaves PIP2. IP3 binds receptors on the endoplasmic reticulum → releases stored Ca²⁺ into the cytoplasm → triggers responses including muscle contraction, exocytosis, and enzyme activation." },
  "DAG":               { cat: "Biochemistry",    def: "Diacylglycerol. A second messenger produced alongside IP3 when PLC cleaves PIP2. DAG stays in the membrane and activates PKC together with Ca²⁺. Important in platelet activation, immune signaling, and cell growth pathways." },
  "phospholipase C":   { cat: "Biochemistry",    def: "PLC. An enzyme activated by Gq-coupled receptors. Cleaves PIP2 (a membrane phospholipid) into IP3 (→ Ca²⁺ release from ER) and DAG (→ activates PKC). This pathway mediates responses to acetylcholine (M1/M3), histamine (H1), α1-adrenergic signals, and many growth factors." },
  "tyrosine kinase":   { cat: "Molecular Bio",   def: "An enzyme that phosphorylates tyrosine residues on target proteins. Receptor tyrosine kinases (RTKs) are surface receptors with built-in kinase activity. Activated by growth factors (EGF, insulin, PDGF). Signal through RAS → MAP kinase pathway → cell growth and division. Frequently mutated in cancer." },
  "RTK":               { cat: "Molecular Bio",   def: "Receptor tyrosine kinase. A membrane receptor with kinase activity in its intracellular domain. Activated by growth factors (EGF, insulin, IGF-1, PDGF). Dimerizes on ligand binding → autophosphorylates tyrosines → recruits adaptor proteins → activates RAS → MAPK cascade → gene expression changes, cell growth." },
  "RAS":               { cat: "Molecular Bio",   def: "A small GTP-binding protein that acts as a molecular switch in growth factor signaling. Active when bound to GTP; inactivated by its own GTPase activity. Mutated to a constitutively active form in ~30% of all human cancers (especially pancreatic, colon, lung). Activates the MAPK/ERK cascade → cell proliferation." },
  "epinephrine":       { cat: "Pharmacology",    def: "Adrenaline. A catecholamine released from the adrenal medulla. Acts on α and β adrenergic receptors (GPCRs). β1 (heart): ↑HR, ↑contractility via Gs/cAMP/PKA. β2 (lungs): bronchodilation. α1 (vessels): vasoconstriction via Gq/IP3/Ca²⁺. Fight-or-flight response." },
  "glucagon":          { cat: "Endocrinology",   def: "A peptide hormone from pancreatic α-cells released when blood glucose falls. Binds Gs-coupled GPCR on hepatocytes → ↑cAMP → PKA activates glycogen phosphorylase (glycogenolysis) and inhibits glycogen synthase → glucose released into blood. Opposite of insulin." },
  "nitric oxide":      { cat: "Physiology",      def: "NO. A gaseous signaling molecule synthesized from arginine by nitric oxide synthase (NOS). Diffuses into smooth muscle cells → activates guanylyl cyclase → ↑cGMP → PKG → smooth muscle relaxation → vasodilation. Mechanism of nitroglycerin (NO donor) and sildenafil (PDE5 inhibitor that prevents cGMP breakdown)." },
  "cGMP":              { cat: "Biochemistry",    def: "Cyclic GMP. A second messenger produced by guanylyl cyclase in response to nitric oxide (NO) and atrial natriuretic peptide (ANP). Activates Protein Kinase G (PKG) → smooth muscle relaxation and vasodilation. Degraded by PDE5 — sildenafil inhibits PDE5 → ↑cGMP → sustained vasodilation." },
  "phosphodiesterase": { cat: "Pharmacology",    def: "PDE. Enzymes that break down cyclic nucleotides (cAMP and cGMP). Inhibiting PDE raises cAMP or cGMP levels, prolonging their effects. PDE5 inhibitors (sildenafil/Viagra): ↑cGMP → smooth muscle relaxation → used for erectile dysfunction and pulmonary arterial hypertension. Methylxanthines (caffeine, theophylline) inhibit PDE → ↑cAMP." },
  "cholera toxin":     { cat: "Microbiology",    def: "A toxin from Vibrio cholerae that permanently activates Gs protein by ADP-ribosylating Gsα, locking it in the GTP-bound (active) state. Result: constitutive adenylyl cyclase activation → massive ↑cAMP in intestinal epithelial cells → CFTR channels open → Cl⁻ secretion → water follows → rice-water diarrhea." },
  "pertussis toxin":   { cat: "Microbiology",    def: "A toxin from Bordetella pertussis (whooping cough). ADP-ribosylates Giα, locking it in the GDP-bound (inactive) state → Gi cannot inhibit adenylyl cyclase → cAMP rises. Also inhibits G protein-mediated chemokine signaling → impairs immune cell migration." },
  "feedback inhibition":{ cat: "Biochemistry",   def: "A regulatory mechanism where the end product of a pathway inhibits an earlier step, preventing overproduction. Example: high ATP inhibits phosphofructokinase-1 in glycolysis. High cholesterol inhibits HMG-CoA reductase. Maintains metabolic balance through allosteric regulation." },
  "allosteric":        { cat: "Biochemistry",    def: "Regulation by binding at a site other than the active site. Allosteric activators increase enzyme activity; allosteric inhibitors decrease it. Both change the enzyme's shape (conformation). Allows cells to rapidly tune metabolic pathways without new protein synthesis." },
  "kinase":            { cat: "Molecular Bio",   def: "An enzyme that transfers a phosphate group from ATP to a target protein (phosphorylation). Phosphorylation can activate or inhibit the target. Kinases are the workhorses of cellular signaling — PKA, PKC, RTKs, MAP kinases all work by phosphorylating downstream targets." },
  "phosphatase":       { cat: "Molecular Bio",   def: "An enzyme that removes phosphate groups from proteins (dephosphorylation). Opposes kinases. Phosphatases turn off kinase-activated signals. PP1 and PP2A are major serine/threonine phosphatases. Protein tyrosine phosphatases (PTPs) oppose RTK signaling. Balance between kinase and phosphatase activity controls cell behavior." },
  "hormone":           { cat: "Endocrinology",   def: "A signaling molecule secreted by one cell that travels through the bloodstream to affect distant target cells. Peptide hormones (insulin, glucagon, ADH): water-soluble, bind surface receptors, use second messengers. Steroid hormones (cortisol, estrogen, testosterone): lipid-soluble, diffuse into cells, bind nuclear receptors." },
  "autocrine":         { cat: "Physiology",      def: "A signaling mode where a cell secretes a signal that acts back on itself. Example: cancer cells often secrete growth factors that stimulate their own proliferation. Distinct from paracrine (signals to nearby cells) and endocrine (signals travel through blood to distant cells)." },
  "paracrine":         { cat: "Physiology",      def: "A signaling mode where a cell secretes a signal that acts on nearby cells. Does not enter the bloodstream. Examples: neurotransmitters (synapse), NO (vasodilation), growth factors in wounds. Most rapid form of cell communication after direct contact." },
};

// Build a sorted list of terms by length (longest first) to avoid partial matches
const SORTED_TERMS = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);

// ── SPACED REPETITION ─────────────────────────────────────────────────────────
const INTERVALS = [1, 3, 7, 14, 30, 60];
const todayStr = () => new Date().toISOString().split("T")[0];
const addDays = (dateStr, n) => { const d = new Date(dateStr); d.setDate(d.getDate() + n); return d.toISOString().split("T")[0]; };
const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

// ── CURRICULUM ────────────────────────────────────────────────────────────────
const CURRICULUM = [
  { phase: 0, phaseTitle: "Pre-Medical Foundations", phaseColor: "#4a6741", units: [
    { id: "p0u1", title: "Cell Biology & Basic Chemistry", lessons: [
      { id: "p0u1l1", title: "The Cell: Architecture of Life" },
      { id: "p0u1l2", title: "The Cell Membrane & Transport" },
      { id: "p0u1l3", title: "Organelle Functions" },
      { id: "p0u1l4", title: "Cell Signaling" },
      { id: "p0u1l5", title: "Acid-Base Chemistry", locked: true },
    ]},
    { id: "p0u2", title: "Genetics & Molecular Biology", lessons: [
      { id: "p0u2l1", title: "DNA Structure & Replication", locked: true },
      { id: "p0u2l2", title: "Transcription & Translation", locked: true },
      { id: "p0u2l3", title: "Mendelian Genetics", locked: true },
    ]},
    { id: "p0u3", title: "Biochemistry Primer", lessons: [
      { id: "p0u3l1", title: "Amino Acids & Proteins", locked: true },
      { id: "p0u3l2", title: "Enzyme Kinetics", locked: true },
      { id: "p0u3l3", title: "Glycolysis", locked: true },
      { id: "p0u3l4", title: "TCA Cycle & Electron Transport", locked: true },
    ]},
  ]},
  { phase: 1, phaseTitle: "Year 1 Basic Sciences", phaseColor: "#2c4a72", units: [
    { id: "p1u1", title: "Gross Anatomy", lessons: [{ id: "p1u1l1", title: "Thorax & Heart", locked: true }] },
    { id: "p1u2", title: "Neuroanatomy", lessons: [{ id: "p1u2l1", title: "Spinal Cord Tracts", locked: true }] },
    { id: "p1u3", title: "Medical Physiology", lessons: [{ id: "p1u3l1", title: "Cardiac Physiology", locked: true }] },
  ]},
  { phase: 2, phaseTitle: "Pathology, Pharm & Micro", phaseColor: "#8b4a2e", units: [
    { id: "p2u1", title: "General Pathology", lessons: [{ id: "p2u1l1", title: "Cell Injury & Death", locked: true }] },
  ]},
];

// ── LESSONS ───────────────────────────────────────────────────────────────────
const LESSONS = {
  p0u1l1: {
    title: "The Cell: Architecture of Life", subtitle: "Phase 0 · Unit 1 · Lesson 1",
    source: "Campbell Biology 12e, Ch. 6  ·  Lippincott Biochemistry 8e, Ch. 1", readTime: "45 min", badge: "HIGH YIELD",
    sections: [
      { heading: "Why You're Starting Here", body: `Every disease is ultimately a disease of cells. Cancer is uncontrolled cell division. Heart failure is cardiomyocytes that can no longer contract. Alzheimer's disease is neurons drowning in misfolded protein and dying.\n\nBefore you can understand what goes wrong, you need to understand the machine itself. This is not background material — Step 1 assumes you know this cold.` },
      { heading: "The Two Cell Types", body: `Every living organism on Earth is built from one of two cell architectures. This distinction is the biological basis for why antibiotics can kill bacteria without killing you.\n\nPROKARYOTES have no membrane-bound nucleus. Their DNA floats free in the cytoplasm as a single circular chromosome. Their ribosomes are 70S, built from a 30S and 50S subunit. No mitochondria. No Golgi. No ER. All bacteria are prokaryotes.\n\nEUKARYOTES have a membrane-bound nucleus, linear chromosomes, and specialized organelles. Every cell in your body is eukaryotic, with 80S ribosomes (40S + 60S subunits).` },
      { type: "callout", variant: "info", heading: "What is a Svedberg (S)?", body: `The "S" stands for Svedberg — a unit measuring how fast a particle sediments when spun in a centrifuge. Larger, denser particles sediment faster and get higher numbers.\n\nCritically, Svedberg units don't add up: 30S + 50S = 70S ribosome, not 80S. The combined shape is more compact. The structural difference between 70S and 80S is what matters for drug targeting.` },
      { type: "table", heading: "Ribosome Reference", rows: [["Cell Type","Ribosome","Subunits"],["Bacteria (prokaryote)","70S","30S + 50S"],["Your cells (eukaryote)","80S","40S + 60S"],["Your mitochondria","70S","30S + 50S  ← same as bacteria"]] },
      { type: "callout", variant: "clinical", heading: "Clinical Connection — Aminoglycosides", body: `Aminoglycoside antibiotics (gentamicin, streptomycin, tobramycin) bind the bacterial 30S ribosomal subunit and cause misreading of the genetic code — producing garbled, nonfunctional proteins. The bacterium dies.\n\nYour 80S ribosomes are structurally different enough that the drug ignores them. That size difference IS the therapeutic window.` },
      { heading: "The Plot Twist: Mitochondria", body: `Mitochondria were almost certainly once free-living bacteria, engulfed by an ancestral eukaryotic cell billions of years ago — the Endosymbiotic Theory. Evidence: mitochondria have their own circular DNA, divide by binary fission, and have 70S ribosomes — identical architecture to bacteria.\n\nClinical consequence: some antibiotics accidentally hit mitochondrial ribosomes. Chloramphenicol inhibits the 50S subunit and can cause aplastic anemia because rapidly dividing bone marrow cells depend heavily on mitochondrial protein synthesis. Linezolid carries the same risk with prolonged use.` },
      { heading: "The Plasma Membrane", body: `The membrane is a phospholipid bilayer — two sheets of phospholipids arranged tail-to-tail. Each phospholipid has a hydrophilic phosphate head and two hydrophobic fatty acid tails. In water, they spontaneously arrange so the tails hide in the middle. Pure thermodynamics.\n\nThe Fluid Mosaic Model (Singer & Nicolson, 1972) describes the membrane as a two-dimensional fluid in which proteins float like icebergs.\n\nFLUIDITY: Unsaturated fatty acids have kinked tails — they can't pack tightly. Saturated fats pack tightly, stiffer membrane. Cholesterol fills gaps and reduces fluidity at body temperature, acting as a buffer.\n\nASYMMETRY: Phosphatidylserine sits on the inner leaflet in healthy cells. When a cell undergoes apoptosis, it flips to the outer leaflet. Macrophages recognize this as an "eat me" signal.` },
      { type: "callout", variant: "pearl", heading: "Step 1 Pearl", body: `Phosphatidylserine on the outer leaflet = apoptosis "eat me" signal. Directly tested.\n\nHealthy cell = phosphatidylserine on inner leaflet only.\nApoptotic cell = phosphatidylserine flipped to outer leaflet.` },
      { heading: "How Things Cross the Membrane", body: `PASSIVE DIFFUSION — no energy, no transporter, moves with the gradient. O₂, CO₂, steroid hormones, most lipid-soluble drugs.\n\nFACILITATED DIFFUSION — no energy, requires a protein. GLUT transporters move glucose. GLUT2 (liver, pancreatic β-cells) has low affinity/high capacity — acts as a glucose sensor.\n\nPRIMARY ACTIVE TRANSPORT — requires ATP, moves against gradient. Na⁺/K⁺-ATPase: 3 Na⁺ out, 2 K⁺ in per ATP.\n\nSECONDARY ACTIVE TRANSPORT — uses ion gradient, no direct ATP. SGLT transporters co-transport glucose with Na⁺.` },
      { type: "callout", variant: "clinical", heading: "Clinical Connection — Digoxin", body: `Digoxin blocks the Na⁺/K⁺-ATPase. Follow the chain:\n\n1. ATPase inhibited → intracellular Na⁺ rises\n2. Na⁺/Ca²⁺ exchanger loses its driving force → less Ca²⁺ expelled\n3. Intracellular Ca²⁺ rises → stronger heartbeat\n\nNote: calcium is Ca²⁺ not Ca⁺. The exchanger moves 3 Na⁺ in for every 1 Ca²⁺ out due to charge difference. That entire chain = one Step 1 vignette.` },
      { type: "callout", variant: "clinical", heading: "Clinical Connection — SGLT2 Inhibitors", body: `SGLT2 in the kidney proximal tubule reabsorbs glucose. SGLT2 inhibitors (empagliflozin, dapagliflozin — the "-gliflozins") block this, forcing glucose into urine.\n\nThey also reduce cardiovascular mortality and slow diabetic kidney disease — one of the most important drug classes of the last decade.` },
      { type: "summary", heading: "Lesson Summary", points: ["Prokaryote ribosomes: 70S (30S + 50S) — antibiotic target","Eukaryote ribosomes: 80S (40S + 60S) — not targeted","Mitochondria ribosomes: 70S — explains chloramphenicol bone marrow toxicity","Phosphatidylserine flip to outer leaflet = apoptosis 'eat me' signal","Na⁺/K⁺-ATPase: 3 Na⁺ out, 2 K⁺ in, per ATP","Digoxin: blocks ATPase → ↑Na⁺ → ↑Ca²⁺ → ↑contractility","GLUT2: low affinity/high capacity = glucose sensor in β-cells & hepatocytes","SGLT2 inhibitors: block kidney glucose reabsorption — T2DM & heart failure"] }
    ],
    quiz: [
      { q: "You are treating a patient with a serious bacterial infection. You choose gentamicin, an aminoglycoside antibiotic. Why does gentamicin kill bacteria without harming your patient's own cells?", options: ["It destroys the bacterial cell wall, which human cells lack","It targets the bacterial 70S ribosome, which human cells don't use for protein synthesis","It blocks bacterial DNA replication while human DNA is protected inside the nucleus","It acidifies the bacterial cytoplasm, which human cells can buffer"], correct: 1, explanation: "Bacteria have 70S ribosomes (30S + 50S). Aminoglycosides bind the 30S subunit, causing misreading of mRNA → garbled proteins → bacterial death. Human cells use 80S ribosomes (40S + 60S), which aminoglycosides don't bind. This size difference is the entire basis of selective toxicity." },
      { q: "A patient taking chloramphenicol for a serious infection develops severe bone marrow suppression (aplastic anemia). This is an unusual side effect — chloramphenicol targets bacterial ribosomes. Why does it damage human bone marrow cells?", options: ["Chloramphenicol crosses into the nucleus and inhibits human DNA replication","Bone marrow cells express bacterial-type 70S ribosomes in their mitochondria, which chloramphenicol inhibits","Bone marrow cells have leaky membranes that allow more drug uptake than other tissues","Chloramphenicol depletes folate, which rapidly dividing cells depend on"], correct: 1, explanation: "Mitochondria have 70S ribosomes — evidence for the Endosymbiotic Theory. Chloramphenicol targets the 50S subunit and accidentally inhibits mitochondrial ribosomes. Rapidly dividing bone marrow cells depend heavily on mitochondrial protein synthesis, making them most vulnerable. This is why chloramphenicol is reserved for life-threatening infections." },
      { q: "A 72-year-old man with heart failure is started on digoxin. Step by step — why does blocking the Na⁺/K⁺-ATPase make the heart beat stronger?", options: ["Less Na⁺ outside the cell increases the resting membrane potential, directly stimulating contraction","Blocked pump → ↑intracellular Na⁺ → Na⁺/Ca²⁺ exchanger can't expel Ca²⁺ → ↑intracellular Ca²⁺ → stronger contraction","Blocked pump → ↑extracellular K⁺ → cardiac muscle depolarizes more easily","Digoxin directly binds calcium channels, increasing Ca²⁺ entry"], correct: 1, explanation: "Follow the chain: Na⁺/K⁺-ATPase blocked → Na⁺ can't be pumped out → intracellular Na⁺ rises → the Na⁺/Ca²⁺ exchanger (which normally expels Ca²⁺ by bringing Na⁺ in) loses its driving force → Ca²⁺ accumulates inside the cell → stronger cardiac contraction. Digoxin never touches Ca²⁺ channels directly." },
      { q: "A cell is undergoing apoptosis. A macrophage nearby recognizes it and engulfs it cleanly without triggering inflammation. What molecular signal on the dying cell's surface did the macrophage detect?", options: ["Cytochrome c released from mitochondria onto the cell surface","Phosphatidylserine flipped from the inner leaflet to the outer leaflet of the plasma membrane","MHC class I molecules disappearing from the cell surface","Caspase-3 cleaving surface proteins, exposing hidden epitopes"], correct: 1, explanation: "In healthy cells, phosphatidylserine is kept on the inner leaflet of the phospholipid bilayer by flippases. During apoptosis, scramblases flip it to the outer leaflet — this is the 'eat me' signal. Macrophage receptors (e.g., TIM-4) recognize phosphatidylserine and phagocytose the dying cell quietly, without releasing inflammatory cytokines. This is a directly tested Step 1 concept." }
    ]
  },
  p0u1l2: {
    title: "The Cell Membrane & Transport — Deeper", subtitle: "Phase 0 · Unit 1 · Lesson 2",
    source: "Campbell Biology 12e, Ch. 7  ·  Lippincott Biochemistry 8e, Ch. 2", readTime: "40 min", badge: "HIGH YIELD",
    sections: [
      { heading: "Water Movement — Osmosis", body: `In Lesson 1 you learned that water crosses the membrane slowly by passive diffusion. But the body needs to move water fast — across kidney tubules, intestinal cells, red blood cells. It does this through aquaporins.\n\nThe rule: water moves from low solute concentration toward high solute concentration. Always. It is chasing the solutes it cannot follow. Osmotic pressure is the force driving this. More solutes dissolved = higher osmolarity = stronger pull on water.` },
      { type: "table", heading: "Tonicity — What Happens to Your Cells", rows: [["Solution","Effect on Cell","Clinical Use"],["Isotonic (0.9% NaCl, LR)","No net water movement","Volume replacement, hemorrhage"],["Hypotonic (D5W after metabolism)","Water flows INTO cell — swells","Treat hypernatremia"],["Hypertonic (3% NaCl)","Water flows OUT of cell — shrinks","Cerebral edema, severe hyponatremia"]] },
      { type: "callout", variant: "pearl", heading: "Step 1 Pearl — Hyponatremia Correction Rate", body: `Correct hyponatremia too fast → osmotic demyelination syndrome (central pontine myelinolysis) — brainstem myelin sheaths destroyed.\n\nRule: correct no faster than 8–10 mEq/L per 24 hours.\nCorrect too slowly → continued brain herniation. Both extremes are fatal.` },
      { heading: "Aquaporins", body: `AQP2 is the aquaporin you must know. It lives in the collecting duct of the kidney. ADH (vasopressin) is released from the posterior pituitary when you're dehydrated. ADH inserts AQP2 channels into the membrane → water reabsorbed → urine concentrates.\n\nNo ADH → no AQP2 → massive dilute urine → Diabetes Insipidus → hypernatremia.\n\nToo much ADH → SIADH → excessive water retention → hyponatremia → urine inappropriately concentrated. Causes: small cell lung cancer (ectopic ADH), CNS injury, carbamazepine, SSRIs.` },
      { type: "table", heading: "The GLUT Transporter Family", rows: [["Transporter","Location","Key Feature"],["GLUT1","RBCs, brain, placenta","Always active — basal glucose uptake"],["GLUT2","Liver, pancreatic β-cells, kidney","Low affinity, high capacity — glucose sensor"],["GLUT3","Neurons","High affinity — grabs glucose when scarce"],["GLUT4","Muscle, adipose tissue","Insulin-dependent — fails in Type 2 DM"]] },
      { type: "callout", variant: "clinical", heading: "Clinical Connection — GLUT4 & Type 2 Diabetes", body: `Healthy: blood glucose rises → insulin released → GLUT4 translocates to cell surface → glucose floods muscle/fat → blood glucose falls.\n\nType 2 DM: cells are insulin resistant → GLUT4 doesn't respond → glucose stays in blood.\n\nKey pearl: exercise independently stimulates GLUT4 translocation via the AMPK pathway — without insulin. This is why exercise lowers blood glucose even when insulin signaling is impaired.` },
      { heading: "How the Intestine Absorbs Nutrients", body: `The intestinal epithelial cell has two faces. The apical face (brush border microvilli) faces the gut lumen. The basolateral face faces the bloodstream. Different transporters on each face — deliberately.\n\nGLUCOSE ABSORPTION: Apical — SGLT1 co-transports glucose + Na⁺ from lumen into cell. Basolateral — GLUT2 moves glucose into bloodstream. Na⁺/K⁺-ATPase on basolateral side restores the Na⁺ gradient.\n\nOral rehydration therapy (ORT): Cholera toxin causes massive Cl⁻ secretion → water loss → diarrhea. But SGLT1 is untouched. Give glucose + NaCl orally → SGLT1 absorbs glucose + Na⁺ → water follows osmotically → patient rehydrates.` },
      { heading: "Fat Absorption", body: `Step 1 — Emulsification: Bile salts from the liver/gallbladder break fat into tiny droplets in the duodenum.\n\nStep 2 — Digestion: Pancreatic lipase cleaves triglycerides into monoglycerides and fatty acids.\n\nStep 3 — Micelles: Bile salts surround fatty acids into micelles — carriers that ferry fats to the brush border.\n\nStep 4 — Absorption: Fatty acids diffuse passively through the apical membrane (hydrophobic). Reassembled into triglycerides in smooth ER.\n\nStep 5 — Packaging: Triglycerides + cholesterol + apolipoprotein B-48 → chylomicrons in Golgi → enter lacteals (lymphatics) → thoracic duct → bloodstream.` },
      { type: "callout", variant: "pearl", heading: "Step 1 Pearl — Fat-Soluble Vitamins", body: `Fat-soluble vitamins A, D, E, K travel with fat in micelles. Any fat malabsorption = deficiency.\n\n• CF → blocked pancreatic duct → no lipase → Vitamin K deficiency → elevated PT/INR → bleeding\n• Cholestasis → no bile → no micelles\n• Celiac disease → villous atrophy → reduced absorption\n\nVitamin K activates clotting factors II, VII, IX, X. Deficiency → prolonged PT/INR.` },
      { heading: "Why Some Drugs Can't Be Taken Orally", body: `First-pass effect: after intestinal absorption, blood flows to the liver via the portal vein before reaching systemic circulation. Hepatic CYP450 enzymes metabolize a fraction immediately.\n\nNitroglycerin is almost completely destroyed by hepatic first-pass if swallowed — given sublingually (under the tongue → systemic venous circulation, bypassing the liver) or as a patch.\n\nLidocaine: near-complete first-pass — IV only. Morphine: oral dose must be much higher than IV because a large fraction is metabolized before reaching the brain.` },
      { type: "summary", heading: "Lesson Summary", points: ["Osmosis: water moves toward higher solute concentration","Isotonic = no net water movement (0.9% NaCl, LR)","Hypotonic = water into cell — swelling — treat hypernatremia","Hypertonic = water out of cell — shrinkage — treat cerebral edema","AQP2: kidney collecting duct water channel — inserted by ADH","Central DI: no ADH → no AQP2 → dilute polyuria → ↑ serum Na⁺","SIADH: excess ADH → ↑ water retention → ↓ serum Na⁺","GLUT4: muscle + fat, insulin-dependent — fails in Type 2 DM","Exercise → GLUT4 translocation without insulin (AMPK pathway)","SGLT1: intestinal glucose absorption — basis of oral rehydration therapy","Fat: bile → emulsify → lipase → micelles → chylomicrons → lymph","Fat-soluble vitamins A, D, E, K lost in any fat malabsorption","First-pass effect: portal vein → liver before systemic circulation","Nitroglycerin: sublingual to bypass first-pass; lidocaine: IV only"] }
    ],
    quiz: [
      { q: "A patient is brought to the ER with a serum sodium of 108 mEq/L (severely low). You want to correct it quickly — but your senior resident stops you. What is the danger of correcting hyponatremia too rapidly?", options: ["Rapid correction causes fluid overload and pulmonary edema","Rapid correction causes osmotic demyelination syndrome — myelin sheaths in the brainstem are destroyed as water exits cells too quickly","Rapid correction drives Na⁺ into neurons, causing seizures directly","Rapid correction causes renal tubular acidosis from the saline infusion"], correct: 1, explanation: "Brain cells adapt to chronic hyponatremia by losing osmoles to match the low extracellular environment. If you correct Na⁺ too fast, water exits these adapted neurons rapidly → osmotic demyelination syndrome (central pontine myelinolysis). Rule: correct no faster than 8–10 mEq/L per 24 hours. The consequence is permanent brainstem damage." },
      { q: "A patient presents with polyuria (urinating enormous volumes of dilute urine), extreme thirst, and a high serum sodium. Brain imaging shows a mass destroying the posterior pituitary. What is the pathophysiologic chain from posterior pituitary damage to dilute urine?", options: ["No posterior pituitary → no oxytocin → uterine smooth muscle unable to retain urine","No posterior pituitary → no ADH → no AQP2 insertion in collecting duct → water not reabsorbed → dilute urine floods out","No posterior pituitary → no TSH → hypothyroidism → reduced kidney concentrating ability","No posterior pituitary → no ADH → increased aldosterone → sodium wasting → osmotic diuresis"], correct: 1, explanation: "ADH (vasopressin) is made in the hypothalamus and stored/released from the posterior pituitary. ADH acts on kidney collecting duct cells to insert AQP2 water channels. Without ADH: no AQP2 → water passes straight through the collecting duct → massive dilute urine (Central Diabetes Insipidus). Serum Na⁺ rises because water is lost without solute." },
      { q: "During a cholera outbreak, you are treating a severely dehydrated child with no IV access. You have clean water, table sugar, and salt. How does giving glucose + salt orally rehydrate a patient whose intestines are actively secreting fluid?", options: ["Glucose inhibits adenylyl cyclase, reversing the cholera toxin effect and stopping fluid secretion","SGLT1 on the intestinal brush border is untouched by cholera toxin — it co-transports glucose + Na⁺ into the cell, and water follows osmotically","GLUT2 on the apical membrane absorbs glucose, creating an osmotic gradient that pulls water in","The glucose provides ATP to power Na⁺/K⁺-ATPase directly, restoring normal transport"], correct: 1, explanation: "Cholera toxin permanently activates adenylyl cyclase → ↑cAMP → CFTR Cl⁻ channels open → massive Cl⁻ secretion → water follows → profuse watery diarrhea. But SGLT1 (the apical co-transporter) is unaffected. When you give glucose + Na⁺ orally, SGLT1 absorbs both → water follows osmotically back into the cell → net absorption. This is the mechanism behind oral rehydration therapy, which saves ~500,000 lives annually." },
      { q: "A patient with cystic fibrosis is found to have a significantly elevated PT/INR and presents with spontaneous bruising. No liver disease. Trace the chain: why does CF cause a bleeding problem?", options: ["CF causes thrombocytopenia by depositing mucus in bone marrow","CF's chronic lung inflammation consumes clotting factors II, VII, IX, X through continuous activation","CF blocks pancreatic ducts → no lipase → dietary fat not digested → micelles can't form → Vitamin K not absorbed → clotting factors not activated","CF causes vitamin K destruction in the liver through oxidative stress from chronic infection"], correct: 2, explanation: "CF: CFTR mutations → thick mucus → pancreatic duct obstruction → pancreatic lipase can't reach the duodenum → dietary fat (triglycerides) not digested → bile salt micelles can't carry fat-soluble vitamins to intestinal cells → Vitamin K not absorbed. Vitamin K is required to activate clotting factors II, VII, IX, X (gamma-carboxylation). Without it: prolonged PT/INR → bleeding. Same chain applies to cholestasis and celiac disease." }
    ]
  },
  p0u1l3: {
    title: "Organelle Functions", subtitle: "Phase 0 · Unit 1 · Lesson 3",
    source: "Campbell Biology 12e, Ch. 6–7  ·  Lippincott Biochemistry 8e, Ch. 1", readTime: "50 min", badge: "HIGH YIELD",
    sections: [
      { heading: "Think of the Cell as a City", body: `Imagine a busy city. It has a city hall that issues all the orders, factories that build products, a postal sorting centre that packages and ships those products, waste disposal plants that break down garbage, and a power station that keeps everything running.\n\nYour cell is exactly this. Each job is done by a different organelle — a small compartment sealed off by its own membrane so it can maintain the specific conditions needed for its work. The reason this matters: every major disease you will study in medical school can be traced back to one of these organelles failing.\n\nIn this lesson, you will meet each organelle, understand exactly what it does, and see what happens in real patients when it breaks.` },
      { heading: "The Nucleus — City Hall", body: `The nucleus is city hall. It is where your DNA lives and where all the instructions that run the cell are stored and issued.\n\nThe nucleus is surrounded by a double membrane called the nuclear envelope. This envelope has gaps in it called nuclear pores — think of them as security checkpoints at the city hall door. Only certain things are allowed in or out.\n\nWhat leaves through the pores: the instructions (mRNA — the copy of a gene that tells ribosomes what protein to make), and the machine parts for building ribosomes.\n\nWhat enters through the pores: proteins that need to get in to do their job — like the proteins that read and copy DNA. These proteins carry a special address tag called a nuclear localization signal (NLS). Without the tag, the security checkpoint won't let them through.\n\nHere's why this matters for medicine: steroid hormones (cortisol, estrogen, testosterone) are small and oily — they slip right through the cell membrane without needing a transporter. Once inside the cell, they grab onto their receptor, which then gains an NLS tag, walks through the nuclear pore, and directly changes which genes are switched on. This is why steroids take hours to days to work — you have to wait for new proteins to actually be made.` },
      { type: "callout", variant: "clinical", heading: "Clinical Connection — Steroids vs Adrenaline", body: `Adrenaline (epinephrine) hits a receptor on the outside of the cell and produces effects in seconds — no need to enter the nucleus.\n\nCortisol enters the cell, travels to the nucleus, and changes gene expression — effects take hours to days.\n\nThis distinction — surface receptor vs nuclear receptor — is one of the most tested concepts in pharmacology on Step 1. When you see a question about "slow onset" hormone effects, think nuclear receptor.` },
      { heading: "The Rough ER — The Protein Factory", body: `After the nucleus issues instructions, something has to build the products. That's the rough endoplasmic reticulum — a network of membranes covered in ribosomes (which is why it looks "rough").\n\nThink of it as the factory floor. Ribosomes read the instructions from the nucleus and assemble proteins, but here's the key rule: the rough ER only handles proteins that are being shipped out — things the cell is going to secrete, put in its own membrane, or send to its internal waste bins (lysosomes).\n\nAs a new protein is being built, if it has a "shipping label" at its beginning (called a signal sequence), the ribosome gets pulled over to the rough ER membrane. The protein is fed directly into the ER as it's being made — like threading pasta through a machine.\n\nInside the rough ER, the protein gets its first modifications: sugar chains are attached (this helps proteins fold correctly and reach the right destination), and the protein gets its initial shape with the help of "chaperone" proteins — think of chaperones as quality-control supervisors. Badly folded proteins get sent back and destroyed.` },
      { type: "callout", variant: "pearl", heading: "Step 1 Pearl — Which Proteins Use the Rough ER?", body: `Any protein leaving the cell or going into a membrane must go through the rough ER. No exceptions.\n\nExamples you need to know:\n• Insulin — secreted by pancreatic β-cells → goes through rough ER\n• Antibodies — secreted by plasma cells → goes through rough ER\n• Lysosomal enzymes — need to reach the cell's waste bins → goes through rough ER\n\nProteins that stay inside the cytoplasm, or go to the nucleus or mitochondria, are built on free-floating ribosomes and skip the rough ER entirely.` },
      { heading: "The Golgi Apparatus — The Post Office", body: `After the rough ER finishes a protein, it gets shipped to the Golgi apparatus — the post office of the cell. The Golgi receives packages from the ER, puts on the final address labels, and sends them to the right destination.\n\nThe Golgi has two sides: the receiving side (called the cis face, which faces the ER) and the shipping side (the trans face, which faces the rest of the cell).\n\nAs proteins move through the Golgi stack, workers inside make final modifications — adding or removing sugar molecules, and most importantly, stamping certain proteins with a special address label called mannose-6-phosphate (M6P). This stamp is the address for the lysosome — the cell's waste bin.\n\nOnce a lysosomal enzyme gets its M6P stamp, the Golgi packs it into a vesicle (a tiny bubble) and ships it directly to the lysosome. Without the stamp, the protein has no address — it gets tossed out of the cell instead of reaching the lysosome.` },
      { type: "callout", variant: "clinical", heading: "Clinical Connection — I-Cell Disease", body: `I-cell disease is what happens when the machine that adds the M6P stamp is broken.\n\nThe enzyme that applies the stamp (called GlcNAc phosphotransferase) is missing. So all lysosomal enzymes leave the Golgi with no address label → they get secreted out of the cell into the bloodstream → the lysosomes inside the cell receive no enzymes → undigested waste piles up inside lysosomes → the cells look stuffed with debris under a microscope (the "inclusion cells" that give the disease its name).\n\nThe diagnostic clue: lysosomal enzymes are very high in the blood (they leaked out instead of staying inside cells). This is the opposite of what you'd expect and points straight to the diagnosis.` },
      { heading: "Lysosomes — The Waste Disposal Plant", body: `Lysosomes are the cell's garbage disposal units. They are small membrane-bound sacs filled with powerful digestive enzymes that can break down virtually anything — old proteins, worn-out cell parts, bacteria that have been swallowed, and foreign material the cell has engulfed.\n\nHere's the clever trick: lysosomes operate at a very acidic pH of about 4.8 — much more acidic than the rest of the cell (which sits near pH 7.2). Why? Because the digestive enzymes inside only work at that low pH. If a lysosome ever ruptures and spills its contents into the normal cytoplasm, the enzymes stop working — a built-in safety mechanism.\n\nLysosomes receive their cargo from two main sources:\n1. Material swallowed from outside the cell (endocytosis)\n2. Worn-out organelles from inside the cell (a process called autophagy — literally "self-eating")\n\nWhen a lysosomal enzyme is missing from birth, a specific substance builds up over years because nothing can break it down. These are called lysosomal storage diseases, and they are a major Step 1 topic.` },
      { type: "table", heading: "The 5 Lysosomal Storage Diseases You Must Know", rows: [["Disease","What's Missing","What Builds Up","What You'll See"],["Gaucher disease","Glucocerebrosidase","Glucocerebroside","Enlarged spleen and liver, bone pain, 'crinkled paper' macrophages"],["Tay-Sachs disease","Hexosaminidase A","GM2 ganglioside","Cherry-red spot in the eye, progressive brain damage, fatal by age 3–5"],["Niemann-Pick disease","Sphingomyelinase","Sphingomyelin","Cherry-red spot, enlarged liver and spleen, 'foamy' macrophages"],["Fabry disease","α-Galactosidase A","Globotriaosylceramide","Burning pain in hands/feet, kidney failure, skin spots — X-linked"],["Pompe disease","Acid maltase","Glycogen","Massive heart enlargement, floppy muscle tone — 'Pompe trashes the pump'"]] },
      { type: "callout", variant: "pearl", heading: "Step 1 Pearl — The Cherry-Red Spot", body: `A cherry-red spot on the macula (the back of the eye) is a classic exam finding. It appears because fat-laden cells around the fovea go pale, making the vascular fovea look red by contrast.\n\nSeen in Tay-Sachs and Niemann-Pick disease.\n\nAll lysosomal storage diseases are inherited in an autosomal recessive pattern — meaning both parents are carriers — EXCEPT Fabry disease, which is X-linked recessive (mostly affects males).` },
      { heading: "The Smooth ER — The Chemical Factory", body: `The smooth ER is the rough ER without ribosomes. Instead of making proteins, it handles chemical reactions — specifically lipids, hormones, and detoxification.\n\nDifferent cell types use their smooth ER for different jobs:\n\nIn the LIVER: The smooth ER contains CYP450 enzymes that detoxify drugs and alcohol. Heavy drinkers and people on many medications actually grow more smooth ER in their liver cells — the body's attempt to handle the extra workload. This is why chronic drinkers can process alcohol faster than non-drinkers.\n\nIn the ADRENAL GLANDS and GONADS: The smooth ER makes steroid hormones — cortisol, aldosterone, testosterone, estrogen.\n\nIn MUSCLE CELLS: The smooth ER becomes the sarcoplasmic reticulum (SR) — a specialised tank that stores calcium. When a nerve signals a muscle to contract, the SR releases a flood of calcium. The calcium triggers contraction. When the signal stops, the SR pumps the calcium back in, and the muscle relaxes.` },
      { type: "callout", variant: "clinical", heading: "Clinical Connection — Malignant Hyperthermia", body: `During surgery, certain anaesthesia drugs can trigger a rare and life-threatening reaction in patients with a specific genetic mutation.\n\nThe mutation is in a protein called the ryanodine receptor — the gate that lets calcium out of the sarcoplasmic reticulum. The mutation makes this gate stick open.\n\nWhat happens: anaesthetic drug is given → ryanodine receptors open and won't close → calcium floods out of the SR throughout all the body's muscles → every muscle contracts and won't let go → enormous amounts of ATP are burned trying to pump the calcium back → body temperature spikes dangerously (above 40°C) → patient can go into cardiac arrest.\n\nTreatment: dantrolene, a drug that slams the ryanodine receptor shut, stopping the calcium flood. Time-critical — this kills quickly without treatment.` },
      { heading: "Mitochondria — The Power Station (and the Bomb)", body: `You already know from Lesson 1 that mitochondria make ATP (energy) and have bacterial-type 70S ribosomes. Now the deeper picture.\n\nMitochondria have two membranes, and the space between them matters enormously.\n\nThe OUTER membrane is fairly permeable — most small molecules pass through it freely.\n\nThe INNER membrane is almost completely impermeable. This is where the cell's energy-generating machinery lives — a series of protein complexes called the electron transport chain. They pump hydrogen ions (protons) from the inside (called the matrix) into the space between the two membranes. This builds up pressure, like water building behind a dam. When the protons flow back through a special protein called ATP synthase — like water through a turbine — ATP is generated. The impermeability of the inner membrane is what makes this possible.\n\nBut here's the part that surprises most people: trapped in the space between the two membranes is a protein called cytochrome c. In a healthy cell, it just sits there. But if the cell suffers enough damage — too much DNA damage, too much stress — proteins called BAX and BAK punch holes in the outer membrane. Cytochrome c spills out into the cytoplasm. Once it's out, it triggers an automatic self-destruct sequence that kills the cell in an orderly way. This is apoptosis — controlled cell death, which you learned about in Lesson 1.\n\nCancers often learn to block this system by overproducing a protein called BCL-2, which keeps BAX and BAK from ever punching those holes. A newer drug called venetoclax works by disabling BCL-2, forcing cancer cells to die the way they're supposed to.` },
      { heading: "Peroxisomes — Specialist Cleanup Crew", body: `Peroxisomes are small organelles with one very specific job: handling toxic substances that the cell can't deal with anywhere else.\n\nTheir two main tasks:\n\n1. BREAKING DOWN VERY LONG FAT CHAINS. Regular fat molecules get broken down in the mitochondria. But some fats are so long (called very long-chain fatty acids, or VLCFAs) that they can't fit into the mitochondria. Peroxisomes chop these long chains into shorter pieces — then hand the smaller pieces to the mitochondria to finish the job.\n\n2. NEUTRALISING HYDROGEN PEROXIDE. Many chemical reactions in the cell produce a toxic byproduct called hydrogen peroxide (H₂O₂) — the same stuff in bleach. Peroxisomes contain an enzyme called catalase that converts it harmlessly: hydrogen peroxide → water + oxygen.\n\nWhen peroxisomes are missing entirely — due to a genetic defect called Zellweger syndrome — those very long fat chains have nowhere to go. They pile up in the brain, liver, and adrenal glands, causing severe brain damage from birth. Babies with Zellweger syndrome have characteristic facial features, profound hypotonia (floppy muscle tone), and do not survive long. There is no treatment.` },
      { type: "summary", heading: "Lesson Summary", points: [
        "The cell is compartmentalised — each organelle maintains its own environment so incompatible reactions can run simultaneously",
        "Nucleus = DNA storage + command centre; nuclear pores control what enters and exits; proteins need an NLS address tag to get in",
        "Steroid hormones (cortisol, oestrogen, testosterone) enter the cell and nucleus directly → slow effects (hours to days) via gene changes",
        "Rough ER = factory for proteins being secreted, put in membranes, or sent to lysosomes; adds sugar chains; checks protein folding",
        "Golgi = post office; sorts proteins; stamps lysosomal enzymes with a mannose-6-phosphate (M6P) address label",
        "I-cell disease: M6P stamp enzyme missing → lysosomal enzymes secreted out of cell → lysosomes fill with debris → high blood lysosomal enzymes",
        "Lysosomes = waste disposal; pH 4.8; digest engulfed material, bacteria, and worn organelles (autophagy)",
        "Lysosomal storage diseases: one enzyme missing → one substance piles up → organ damage; all autosomal recessive except Fabry (X-linked)",
        "Tay-Sachs and Niemann-Pick: cherry-red spot on the macula; Gaucher: crinkled macrophages; Pompe: heart and muscle",
        "Smooth ER = lipid and steroid synthesis + drug detox (CYP450 in liver); in muscle cells becomes sarcoplasmic reticulum (SR)",
        "SR stores Ca²⁺; releases it to trigger muscle contraction; malignant hyperthermia = SR stuck open → uncontrolled contraction → treat with dantrolene",
        "Mitochondria: inner membrane = ATP factory via electron transport chain + ATP synthase; outer membrane breach → cytochrome c → apoptosis",
        "BCL-2 blocks apoptosis; cancers overuse it; venetoclax disables BCL-2 to force cancer cell death",
        "Peroxisomes: break down very long-chain fatty acids + neutralise H₂O₂ via catalase; absent in Zellweger syndrome → VLCFA accumulation → brain damage"
      ] }
    ],
    quiz: [
      { q: "A patient takes an oral steroid medication (prednisone) for severe asthma. His doctor explains the drug won't work for several hours. A friend asks why — after all, adrenaline inhalers work in seconds. What is the correct explanation?", options: ["Prednisone is absorbed more slowly from the gut than inhaled adrenaline","Prednisone must enter the cell, travel to the nucleus, and change which genes are switched on — new proteins must be made before the effect appears","Prednisone is broken down by the liver first and only the metabolite is active","Adrenaline directly opens ion channels, while prednisone has to activate the immune system first"], correct: 1, explanation: "Prednisone (a steroid) is lipid-soluble — it crosses the cell membrane easily, binds its intracellular receptor, and the complex enters the nucleus through nuclear pores. Inside the nucleus, it changes gene expression. But you then have to wait for new mRNA to be made, ribosomes to translate it, and the new protein to actually do its job. This takes hours. Adrenaline works in seconds because it hits a receptor on the cell surface and immediately activates second messengers — no nuclear entry, no gene changes needed." },
      { q: "A child is brought to clinic at 6 months old. Parents report she seems to be losing milestones she had already reached — she can no longer hold her head up and has stopped making eye sounds. Eye exam reveals a cherry-red spot on the macula. Enzyme testing shows absent hexosaminidase A. What is happening inside the cells of her brain?", options: ["The rough ER cannot fold proteins correctly, so neurons are dying from protein misfolding","The Golgi is not stamping lysosomal enzymes with their address label, so enzymes are leaking out","A specific lysosomal enzyme is missing, so a fatty substance (GM2 ganglioside) is accumulating and clogging neurons","The sarcoplasmic reticulum is releasing too much calcium, damaging neuronal membranes"], correct: 2, explanation: "This is Tay-Sachs disease. Hexosaminidase A is a lysosomal enzyme that breaks down GM2 ganglioside. Without it, GM2 accumulates inside lysosomes within neurons — the lysosomes swell, the neurons balloon, and eventually die. The cherry-red spot appears because ganglion cells around the central fovea become pale and opaque from lipid accumulation, making the well-vascularised fovea look red by contrast. There is no cure; the disease is uniformly fatal." },
      { q: "During a routine surgery, a 24-year-old man receiving general anaesthesia suddenly develops a dangerously high temperature (41°C), extreme muscle rigidity, and his blood tests show signs of muscle breakdown. His father had the same reaction during a surgery years ago. What is the mechanism behind this reaction, and what is the correct treatment?", options: ["The anaesthetic blocked ATP production in mitochondria; treat with IV glucose","A genetic mutation causes the sarcoplasmic reticulum calcium gate to stick open, flooding muscles with calcium and causing uncontrolled contraction; treat with dantrolene","The patient has an allergy to the anaesthetic drug causing a systemic inflammatory reaction; treat with adrenaline","The anaesthetic blocked lysosomal function, causing cell death in muscle; treat with steroids"], correct: 1, explanation: "This is malignant hyperthermia. A mutation in the ryanodine receptor (the sarcoplasmic reticulum calcium release channel) causes it to fly open and stay open when triggered by certain anaesthetic drugs. Calcium floods out of the SR into every muscle cell → sustained, uncontrolled muscle contraction throughout the body → massive ATP consumption → heat generated → temperature rises → rhabdomyolysis → cardiac arrest. Treatment is dantrolene, which directly blocks the ryanodine receptor and stops the calcium flood. Delay in giving dantrolene can be fatal." },
      { q: "A newborn is diagnosed with I-cell disease. The doctor explains to the parents that the problem is not inside the lysosomes themselves — the lysosomes are actually empty of enzymes. The enzymes are being found in unusually high amounts in the baby's blood. Why are the lysosomal enzymes in the blood instead of inside the cells?", options: ["The lysosomal membranes have holes in them, leaking enzymes into the bloodstream","The enzyme that stamps lysosomal proteins with their address label (mannose-6-phosphate) is broken, so the Golgi sends the enzymes out of the cell by default","The nuclear pores are blocked, so the instructions for making lysosomal enzymes never leave the nucleus","The rough ER is making too many enzymes and the excess spills into the blood"], correct: 1, explanation: "In I-cell disease, the enzyme GlcNAc phosphotransferase is non-functional. Its job is to stamp lysosomal proteins with a mannose-6-phosphate (M6P) tag in the Golgi — the address label that tells the cell 'send this to the lysosome.' Without the stamp, the Golgi has no address for these proteins. They get routed to the default destination: secreted outside the cell. The blood fills with lysosomal enzymes that were never delivered. Meanwhile, the lysosomes are starved of their enzymes and fill up with undigested waste — the 'inclusion cells' visible under the microscope." }
    ]
  },

  p0u1l4: {
    title: "Cell Signaling", subtitle: "Phase 0 · Unit 1 · Lesson 4",
    source: "Campbell Biology 12e, Ch. 11  ·  Lippincott Biochemistry 8e, Ch. 3", readTime: "40 min", badge: "HIGH YIELD",
    sections: [
      { heading: "Cells Need to Talk", body: `Your body has 37 trillion cells, none of which can see or touch each other. Yet when you get a fright, your heart speeds up, your muscles flood with glucose, and your airways open — all within seconds. This coordination happens entirely through chemical signals.\n\nEvery drug you will ever prescribe works by entering this system: mimicking a signal, blocking one, or amplifying one. Cell signaling is not background knowledge — it is the foundation of pharmacology.` },

      { heading: "Step 1: Can the Signal Cross the Membrane?", body: `The membrane question decides everything about how a signal works.\n\nSome signals are water-soluble — things like adrenaline, insulin, and most hormones made of amino acids. Water-soluble molecules cannot pass through the fatty cell membrane. So they stop at the surface and bind a receptor protein sitting on the outside of the cell. The receptor then triggers a chain of events inside using relay molecules.\n\nOther signals are lipid-soluble — steroid hormones like cortisol, oestrogen, and testosterone, plus thyroid hormone. These slip straight through the membrane. They find their receptor inside the cell, and the whole complex moves into the nucleus to directly switch genes on or off.\n\nThis difference in entry explains a difference in speed. Surface receptor effects happen in seconds — no new proteins needed. Nuclear receptor effects take hours to days because you have to wait for new proteins to actually be made.` },

      { type: "table", heading: "The Two Receptor Types at a Glance", rows: [
        ["", "Surface Receptors", "Nuclear Receptors"],
        ["Signal", "Water-soluble (can't enter)", "Lipid-soluble (enters freely)"],
        ["Examples", "Adrenaline, insulin, glucagon", "Cortisol, oestrogen, testosterone"],
        ["Speed", "Seconds to minutes", "Hours to days"],
        ["What they do", "Trigger relay molecules inside cell", "Enter nucleus, change gene expression"],
      ] },

      { heading: "GPCRs — How Most Hormones Get Their Message Inside", body: `The most common surface receptor in the body is called a G protein-coupled receptor, or GPCR. About half of all drugs target these.\n\nThink of a GPCR as a doorbell. The signal (hormone or neurotransmitter) presses the button on the outside. This activates a G protein sitting on the inside face of the membrane — a molecular switch that is OFF when holding GDP and ON when holding GTP.\n\nOnce switched ON, the G protein goes and activates an enzyme inside the cell. That enzyme produces a second messenger — a small molecule that floods the cytoplasm and spreads the signal rapidly. The second messenger then activates kinases, which tag proteins with phosphate groups to switch them on or off.\n\nThere are three G protein types you need to know:\n\nGs ("stimulatory") turns ON adenylyl cyclase, which makes cAMP. More cAMP → activates PKA. This is how adrenaline speeds up the heart and how glucagon tells the liver to release glucose.\n\nGi ("inhibitory") turns OFF adenylyl cyclase → less cAMP. This is how opioids reduce pain signaling and how certain receptors slow the heart.\n\nGq turns ON phospholipase C (PLC), which releases calcium from inside the cell. Calcium floods the cytoplasm and triggers contraction, secretion, and platelet activation.` },

      { type: "callout", variant: "pearl", heading: "Step 1 Pearl — The Most Tested Pathway", body: `Gs → adenylyl cyclase → ↑cAMP → PKA\n\nHormones that use this: adrenaline (β receptors), glucagon, TSH, FSH, LH, ACTH, PTH, ADH, calcitonin.\n\nWhenever a question gives you a hormone acting fast on an organ — heart rate, glucose release, thyroid growth — think Gs/cAMP first. This is the single highest-yield signaling chain on Step 1.` },

      { type: "callout", variant: "clinical", heading: "Clinical Connection — Cholera and Whooping Cough", body: `Both diseases work by breaking the G protein's OFF switch.\n\nNormally, G proteins shut themselves off by hydrolysing GTP back to GDP — a self-destruct timer built in. Cholera toxin permanently disables this timer in Gsα, locking it ON. Adenylyl cyclase runs non-stop → cAMP floods intestinal cells → chloride channels pour Cl⁻ into the gut → water follows → profuse watery diarrhoea (litres per hour).\n\nPertussis toxin (whooping cough) does the same thing to Giα — locks it OFF permanently. Gi can no longer suppress cAMP, and immune cells lose the ability to migrate properly.\n\nBoth toxins, one trick: destroy the timer that turns the G protein off.` },

      { heading: "Following Adrenaline Through the cAMP Pathway", body: `When a fright hits, adrenaline is released. Here is what happens in heart muscle:\n\nAdrenaline binds the β1 receptor → Gs activates adenylyl cyclase → ATP becomes cAMP → PKA is activated → PKA tags calcium channels (more Ca²⁺ enters = stronger beat) and speeds up Ca²⁺ removal (faster relaxation = faster rate).\n\nAt the same moment in the liver, the same hormone → same β2 receptor → same Gs/cAMP/PKA chain → but now PKA activates glycogen breakdown and simultaneously shuts down glycogen synthesis → glucose pours into the blood.\n\nOne second messenger, two tissues, completely different results. The difference is what proteins PKA finds to phosphorylate in each tissue.` },

      { heading: "The Gq Pathway — When Calcium Is the Signal", body: `Some receptors couple to Gq instead of Gs. Gq activates phospholipase C, which splits a membrane lipid into two second messengers at once:\n\nIP3 travels to the endoplasmic reticulum and opens calcium channels → Ca²⁺ floods the cytoplasm.\nDAG stays in the membrane and activates PKC alongside that calcium.\n\nCalcium is the trigger for: smooth muscle contraction, hormone secretion, platelet activation, salivary glands.\n\nAdrenaline on blood vessels uses α1 receptors, which couple to Gq → calcium → contraction → vessels narrow → blood pressure rises. Compare this to β2 receptors (Gs → cAMP → relaxation). Same hormone, different receptor, opposite effect. This is not a contradiction — it is the same molecule producing different responses depending on which receptor is present in that tissue.` },

      { type: "callout", variant: "clinical", heading: "Clinical Connection — Adrenergic Receptors", body: `β1 (Gs → ↑cAMP): heart rate and force. Beta-blockers (metoprolol) block this — used in hypertension and heart failure.\nβ2 (Gs → ↑cAMP): bronchodilation. Salbutamol activates this in asthma attacks.\nα1 (Gq → ↑Ca²⁺): vessel constriction, raises blood pressure. Phenylephrine uses this.\nα2 (Gi → ↓cAMP): reduces further noradrenaline release. Clonidine uses this to lower blood pressure.\n\nFor any adrenergic drug question: identify the receptor subtype → identify the G protein → predict the effect.` },

      { heading: "Growth Factor Receptors and Cancer", body: `GPCRs use G proteins as go-betweens. One other receptor family skips that — receptor tyrosine kinases (RTKs) have a kinase built directly into their own tail.\n\nGrowth factors (EGF, insulin, PDGF) bind RTKs. Two receptors pair up and phosphorylate each other. This recruits relay proteins that activate RAS, a small switch protein. Active RAS drives a cascade that eventually reaches the nucleus and switches on genes for cell growth and division.\n\nNormally RAS fires briefly, then shuts itself off using its own built-in enzyme (GTPase). If that shut-off mechanism is destroyed by a mutation, RAS stays permanently on — pushing cells to grow and divide with no external signal. This is one of the most common events in cancer.\n\nKRAS mutations are found in roughly 90% of pancreatic cancers, 40% of colorectal cancers, and 30% of lung adenocarcinomas.` },

      { heading: "Nitric Oxide — A Gas That Signals", body: `Not all signals are proteins. Nitric oxide (NO) is a dissolved gas that diffuses straight through membranes with no receptor needed at the surface.\n\nBlood vessel walls make NO when stimulated. NO drifts into the smooth muscle layer underneath → activates guanylyl cyclase → makes cGMP → activates PKG → muscle relaxes → vessel opens up.\n\nNitroglycerin tablets (for chest pain) work by releasing NO. They dilate coronary vessels within minutes, reducing how hard the heart has to work.\n\nSildenafil (Viagra) works differently — it blocks the enzyme that breaks down cGMP, so the vasodilation effect lasts longer. Both drugs hijack the same NO→cGMP pathway, just at different steps.` },

      { type: "callout", variant: "pearl", heading: "Step 1 Pearl — cAMP vs cGMP", body: `cAMP: made by adenylyl cyclase, activated by Gs proteins. Used by most fast-acting hormones.\ncGMP: made by guanylyl cyclase, activated by nitric oxide. Used for smooth muscle relaxation.\n\nBoth are broken down by phosphodiesterases (PDEs). Sildenafil blocks PDE5 → cGMP stays high → vasodilation. Caffeine weakly blocks PDEs → cAMP/cGMP stay slightly elevated → mild stimulation.` },

      { heading: "How Signals Turn Off", body: `A signal that never stops is dangerous — cholera is what Gs activation without an off-switch looks like.\n\nCells terminate signals three ways:\n\nG proteins self-deactivate: Gα has a built-in GTPase that converts GTP → GDP, switching itself off within seconds. Cholera toxin destroys this step.\n\nPDEs degrade second messengers: phosphodiesterase enzymes chew up cAMP and cGMP, ending their effects. Sildenafil inhibits the PDE that targets cGMP in certain tissues.\n\nReceptors are pulled inside: if a receptor is stimulated too heavily or for too long, the cell withdraws it from the surface — like taking the doorbell offline. This is called desensitisation or tachyphylaxis. It is why using a salbutamol inhaler every hour stops working — the β2 receptors disappear from the airway cells.` },

      { type: "summary", heading: "Lesson Summary", points: [
        "Water-soluble signals (adrenaline, insulin) cannot cross the membrane — bind surface receptors, act in seconds",
        "Lipid-soluble signals (steroids, thyroid hormone) cross the membrane freely — bind nuclear receptors, act in hours/days",
        "GPCRs are the most common receptor; G proteins are ON (GTP) or OFF (GDP) molecular switches",
        "Gs → adenylyl cyclase → ↑cAMP → PKA: adrenaline (β), glucagon, TSH, FSH, LH, ACTH, PTH, ADH",
        "Gi → ↓cAMP: opioids, α2 adrenergic, M2 muscarinic (slows heart)",
        "Gq → PLC → IP3 (Ca²⁺ from ER) + DAG (→ PKC): α1 adrenergic, M1/M3 muscarinic, H1 histamine",
        "Cholera toxin: Gsα permanently ON → endless cAMP → Cl⁻ and water pour into gut → rice-water diarrhoea",
        "Pertussis toxin: Giα permanently OFF → cAMP rises, immune cells can't migrate",
        "RTKs: growth factor binds → receptors pair and phosphorylate each other → RAS → cell division genes switch on",
        "Mutant RAS (stuck ON) drives ~30% of cancers; KRAS mutated in 90% of pancreatic cancer",
        "NO → guanylyl cyclase → ↑cGMP → PKG → smooth muscle relaxes → vasodilation",
        "Nitroglycerin = NO donor (angina); Sildenafil = PDE5 inhibitor → cGMP stays high",
        "Signals terminate: Gα GTPase self-inactivation, PDEs degrade cAMP/cGMP, receptor internalisation",
        "Tachyphylaxis: too much agonist → receptors pulled off cell surface → reduced effect",
      ] }
    ],
    quiz: [
      { q: "A 19-year-old with asthma uses his salbutamol inhaler during an attack. Salbutamol activates β2-adrenergic receptors on airway smooth muscle. Which sequence correctly explains how this opens up his airways?", options: ["β2 → Gq → PLC → Ca²⁺ release → smooth muscle relaxes","β2 → Gs → adenylyl cyclase → ↑cAMP → PKA → smooth muscle relaxes","β2 → Gi → ↓cAMP → contraction is suppressed → airways open","β2 → RTK → RAS → MAPK → airway gene expression changes"], correct: 1, explanation: "β2 receptors couple to Gs. Gs activates adenylyl cyclase → cAMP rises → PKA is activated. PKA phosphorylates and inactivates myosin light chain kinase (the engine of smooth muscle contraction) → smooth muscle can no longer contract → bronchi open up. The Gq pathway (Ca²⁺) does the opposite — it causes contraction, which is what α1 receptors do in blood vessels. Knowing Gs = relaxation via cAMP is key." },
      { q: "A 3-year-old develops severe watery diarrhoea after drinking contaminated water. Stool culture grows Vibrio cholerae. The toxin it produces permanently prevents Gsα from hydrolysing GTP. What is the direct consequence inside intestinal cells?", options: ["Gsα stuck ON → adenylyl cyclase runs continuously → massive ↑cAMP → Cl⁻ channels open → water pours into the gut","Gsα stuck ON → Ca²⁺ floods the cell → smooth muscle of the gut contracts uncontrollably → cramping diarrhoea","Gsα stuck ON → RTKs become constitutively active → intestinal cells proliferate and secrete mucus","Gsα stuck ON → nucleus is flooded with cAMP → new ion channel genes are transcribed → fluid secretion"], correct: 0, explanation: "Normally Gsα hydrolises its own GTP → GDP, switching itself off after a few seconds. Cholera toxin destroys this self-off switch. Gsα stays permanently ON → adenylyl cyclase never stops → cAMP floods the cell → PKA opens CFTR chloride channels → Cl⁻ pours into the gut lumen → water follows by osmosis → profuse watery diarrhoea. A child can lose dangerous amounts of fluid in hours, which is why rapid oral rehydration is lifesaving." },
      { q: "A 62-year-old gets sudden chest pain while walking. He puts a nitroglycerin tablet under his tongue and the pain eases within 90 seconds. What is the mechanism?", options: ["Nitroglycerin blocks β1 receptors → heart slows down → less oxygen needed → pain resolves","Nitroglycerin releases nitric oxide → guanylyl cyclase → ↑cGMP → smooth muscle of blood vessels relaxes → heart receives more blood and does less work","Nitroglycerin activates Gs → ↑cAMP → PKA → coronary arteries dilate","Nitroglycerin inhibits PDE5 → cAMP accumulates → smooth muscle relaxation"], correct: 1, explanation: "Nitroglycerin is a prodrug that releases nitric oxide (NO). NO diffuses directly into the smooth muscle cells lining blood vessels (no surface receptor needed). It activates guanylyl cyclase → GTP → cGMP → PKG activated → smooth muscle relaxes → vessels dilate. This reduces the heart's workload and allows more blood through narrowed coronary arteries → pain resolves. The sublingual route is used because it bypasses first-pass liver metabolism — as covered in Lesson 2." },
      { q: "A 55-year-old woman with pancreatic cancer is found to have a KRAS mutation. The mutation locks RAS permanently in the active (GTP-bound) state. Why does this cause uncontrolled cell division?", options: ["Permanently active RAS blocks BCL-2 → mitochondria release cytochrome c → apoptosis is suppressed → cells accumulate","Permanently active RAS continuously fires the MAPK growth cascade → cell division genes are always switched on, even with no growth factor present","Permanently active RAS raises cAMP → PKA phosphorylates all cell cycle brakes simultaneously","Permanently active RAS prevents nuclear pores from closing → growth signals are permanently trapped in the nucleus"], correct: 1, explanation: "Normally: growth factor → RTK → RAS switched ON → MAPK cascade → cell division genes activate temporarily → RAS's own GTPase converts GTP → GDP → RAS switches OFF → growth stops. A KRAS mutation destroys that GTPase activity. RAS stays permanently ON → MAPK cascade fires continuously → genes for growth and division are always active, whether a growth signal arrived or not → uncontrolled proliferation → cancer. KRAS mutations are present in 90% of pancreatic cancers and are one of the hardest cancer targets to drug." }
    ]
  }
};

// ── TEXT → ANNOTATED SEGMENTS ─────────────────────────────────────────────────
function parseTextWithTerms(text) {
  const segments = [];
  let remaining = text;
  let safetyCounter = 0;

  while (remaining.length > 0 && safetyCounter < 10000) {
    safetyCounter++;
    let earliestIndex = Infinity;
    let matchedTerm = null;

    for (const term of SORTED_TERMS) {
      const idx = remaining.toLowerCase().indexOf(term.toLowerCase());
      if (idx !== -1 && idx < earliestIndex) {
        // Ensure word boundary (not inside another word)
        const before = idx > 0 ? remaining[idx - 1] : " ";
        const after = idx + term.length < remaining.length ? remaining[idx + term.length] : " ";
        const wordChar = /[a-zA-Z0-9]/;
        if (!wordChar.test(before) && !wordChar.test(after)) {
          earliestIndex = idx;
          matchedTerm = term;
        }
      }
    }

    if (matchedTerm === null) {
      segments.push({ type: "text", content: remaining });
      break;
    }

    if (earliestIndex > 0) segments.push({ type: "text", content: remaining.slice(0, earliestIndex) });
    segments.push({ type: "term", content: remaining.slice(earliestIndex, earliestIndex + matchedTerm.length), term: matchedTerm });
    remaining = remaining.slice(earliestIndex + matchedTerm.length);
  }

  return segments;
}

// ── ANNOTATED TEXT COMPONENT ──────────────────────────────────────────────────
function AnnotatedText({ text, onTerm, style }) {
  const segments = parseTextWithTerms(text);
  return (
    <span style={style}>
      {segments.map((seg, i) =>
        seg.type === "term" ? (
          <span key={i} onClick={e => { e.stopPropagation(); onTerm(seg.term, e); }}
            style={{ borderBottom: `2px dotted ${T.blue}`, color: T.blue, cursor: "pointer", fontWeight: "inherit" }}>
            {seg.content}
          </span>
        ) : (
          <span key={i}>{seg.content}</span>
        )
      )}
    </span>
  );
}

// ── TERM POPUP ────────────────────────────────────────────────────────────────
function TermPopup({ term, onClose, onAddToDictionary, alreadySeen }) {
  const entry = GLOSSARY[term];
  if (!entry) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />
      <div onClick={e => e.stopPropagation()}
        style={{ position: "relative", background: T.surface, borderRadius: "16px 16px 0 0", padding: "20px 20px 32px", width: "100%", maxWidth: 560, maxHeight: "70vh", overflowY: "auto", WebkitOverflowScrolling: "touch", boxShadow: "0 -4px 32px rgba(0,0,0,0.18)" }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: T.border, borderRadius: 2, margin: "0 auto 16px" }} />
        {/* Category badge */}
        <div style={{ display: "inline-block", background: T.blueSoft, color: T.blue, fontSize: 10, fontFamily: T.font, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", padding: "3px 10px", borderRadius: 4, marginBottom: 10 }}>{entry.cat}</div>
        {/* Term */}
        <div style={{ fontFamily: T.font, fontSize: 22, fontWeight: 700, color: T.ink, marginBottom: 12 }}>{term}</div>
        {/* Definition */}
        <div style={{ fontFamily: T.font, fontWeight: 500, fontSize: 16, color: T.inkMid, lineHeight: 1.85 }}>{entry.def}</div>
        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onClose}
            style={{ flex: 1, background: T.bgDeep, border: "none", borderRadius: 8, padding: "12px 0", fontFamily: T.font, fontSize: 14, fontWeight: 600, color: T.inkMid, cursor: "pointer" }}>
            Close
          </button>
          {!alreadySeen && (
            <button onClick={() => { onAddToDictionary(term); onClose(); }}
              style={{ flex: 2, background: T.blue, border: "none", borderRadius: 8, padding: "12px 0", fontFamily: T.font, fontSize: 14, fontWeight: 600, color: "#fff", cursor: "pointer" }}>
              + Add to My Dictionary
            </button>
          )}
          {alreadySeen && (
            <div style={{ flex: 2, background: T.sageSoft, borderRadius: 8, padding: "12px 0", fontFamily: T.font, fontSize: 14, fontWeight: 600, color: T.sage, textAlign: "center" }}>
              ✓ In Your Dictionary
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
function App() {
  const [activeLessonId, setActiveLessonId] = useState("p0u1l1");
  const [view, setView] = useState("lesson");
  const [completed, setCompleted] = useState(() => { try { return JSON.parse(localStorage.getItem("med_done") || "[]"); } catch { return []; } });
  const [recallItems, setRecallItems] = useState(() => { try { return JSON.parse(localStorage.getItem("med_recall") || "[]"); } catch { return []; } });
  const [seenTerms, setSeenTerms] = useState(() => { try { return JSON.parse(localStorage.getItem("med_terms") || "[]"); } catch { return []; } });
  const [quizState, setQuizState] = useState({ current: 0, answers: [], done: false });
  const [practiceQuiz, setPracticeQuiz] = useState(null);   // [{q,options,correct,explanation,topic}]
  const [practiceLoading, setPracticeLoading] = useState(false);
  const [practiceState, setPracticeState] = useState({ current: 0, answers: [], done: false });
  const [practiceError, setPracticeError] = useState(null);
  const [chat, setChat] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dictOpen, setDictOpen] = useState(false);
  const [reviewSession, setReviewSession] = useState(null);
  const [activePopup, setActivePopup] = useState(null); // term string
  const [dictSearch, setDictSearch] = useState("");
  const chatEndRef = useRef(null);
  const lesson = LESSONS[activeLessonId];

  const totalLessons = CURRICULUM.reduce((a, p) => a + p.units.reduce((b, u) => b + u.lessons.length, 0), 0);
  const progress = Math.round((completed.length / totalLessons) * 100);
  const today = todayStr();
  const dueToday = recallItems.filter(item => item.nextReview <= today);
  const upcoming = recallItems.filter(item => item.nextReview > today).sort((a, b) => a.nextReview.localeCompare(b.nextReview)).slice(0, 20);

  useEffect(() => { try { localStorage.setItem("med_done", JSON.stringify(completed)); } catch {} }, [completed]);
  useEffect(() => { try { localStorage.setItem("med_recall", JSON.stringify(recallItems)); } catch {} }, [recallItems]);
  useEffect(() => { try { localStorage.setItem("med_terms", JSON.stringify(seenTerms)); } catch {} }, [seenTerms]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat]);
  useEffect(() => { document.body.style.overflow = (sidebarOpen || dictOpen || activePopup) ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [sidebarOpen, dictOpen, activePopup]);

  // Auto-add terms from lesson to seenTerms when viewing
  useEffect(() => {
    if (view === "lesson" && lesson) {
      const lessonText = lesson.sections.map(s => [s.body || "", s.heading || "", ...(s.points || [])].join(" ")).join(" ");
      const foundTerms = SORTED_TERMS.filter(t => lessonText.toLowerCase().includes(t.toLowerCase()));
      setSeenTerms(prev => {
        const set = new Set(prev);
        foundTerms.forEach(t => set.add(t));
        return [...set];
      });
    }
  }, [activeLessonId, view]);

  const addTermToDictionary = (term) => setSeenTerms(prev => prev.includes(term) ? prev : [...prev, term]);

  const openLesson = (id) => { setActiveLessonId(id); setView("lesson"); setQuizState({ current: 0, answers: [], done: false }); setSidebarOpen(false); };

  const markComplete = async () => {
    setView("quiz");
    setQuizState({ current: 0, answers: [], done: false });
    if (completed.includes(activeLessonId)) return;
    setCompleted(prev => [...prev, activeLessonId]);
    const lessonData = LESSONS[activeLessonId];
    if (!lessonData) return;
    const summarySection = lessonData.sections.find(s => s.type === "summary");
    if (!summarySection) return;
    const points = summarySection.points;

    // Generate questions from bullet points via AI
    let qa = null;
    try {
      const prompt = `Convert each of these medical study facts into a short, clear question a student would answer from memory. The question should test the key concept — not just repeat the fact as a question. Return ONLY a JSON array with no markdown:\n[{"question":"...","answer":"..."}]\n\nFacts:\n${points.map((p, i) => `${i+1}. ${p}`).join("\n")}`;
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 2000,
          messages: [{ role: "user", content: prompt }] })
      });
      const data = await res.json();
      const raw = data.content?.map(c => c.text || "").join("") || "";
      const match = raw.match(/\[[\s\S]*\]/);
      if (match) qa = JSON.parse(match[0]);
    } catch (e) { qa = null; }

    const newItems = points.map((point, i) => ({
      id: `${activeLessonId}_${i}_${Date.now()}`,
      lessonId: activeLessonId, lessonTitle: lessonData.title,
      text: point,
      question: qa?.[i]?.question || null,
      answer: qa?.[i]?.answer || point,
      intervalIndex: 0, nextReview: today, createdAt: today, reviewCount: 0,
    }));
    setRecallItems(prev => {
      const existingKeys = new Set(prev.map(x => `${x.lessonId}_${x.text}`));
      return [...prev, ...newItems.filter(x => !existingKeys.has(`${x.lessonId}_${x.text}`))];
    });
  };

  const answerQuiz = (idx) => {
    const newA = [...quizState.answers, idx];
    if (quizState.current + 1 >= lesson.quiz.length) setQuizState({ ...quizState, answers: newA, done: true });
    else setQuizState({ ...quizState, current: quizState.current + 1, answers: newA });
  };

  const startReview = () => { if (dueToday.length === 0) return; setReviewSession({ items: [...dueToday], current: 0, results: [], revealed: false }); setView("recall"); };
  const revealCard = () => setReviewSession(s => ({ ...s, revealed: true }));
  const gradeCard = (remembered) => {
    setReviewSession(s => {
      const item = s.items[s.current];
      const newIdx = remembered ? Math.min(item.intervalIndex + 1, INTERVALS.length - 1) : 0;
      setRecallItems(prev => prev.map(r => r.id === item.id ? { ...r, intervalIndex: newIdx, nextReview: addDays(today, INTERVALS[newIdx]), reviewCount: r.reviewCount + 1 } : r));
      const newResults = [...s.results, { item, remembered }];
      const next = s.current + 1;
      return next >= s.items.length ? { ...s, results: newResults, current: next, done: true, revealed: false } : { ...s, results: newResults, current: next, revealed: false };
    });
  };

  const generatePracticeQuiz = async () => {
    if (completed.length === 0) return;
    setPracticeLoading(true);
    setPracticeError(null);
    setPracticeQuiz(null);
    setPracticeState({ current: 0, answers: [], done: false });

    // Build topic context from completed lessons
    const completedLessons = completed.map(id => LESSONS[id]).filter(Boolean);

    // Extract every individual testable fact from each lesson
    const allFacts = [];
    completedLessons.forEach(l => {
      const summary = l.sections.find(s => s.type === "summary");
      if (summary) summary.points.forEach(p => allFacts.push({ lesson: l.title, fact: p }));
    });

    // Pick 5 facts at random from different lessons/topics to anchor each question
    const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);
    const shuffledFacts = shuffle(allFacts);
    // Pick 5 spread across as many lessons as possible
    const seen = new Set();
    const anchorFacts = [];
    for (const f of shuffledFacts) {
      if (anchorFacts.length >= 5) break;
      if (!seen.has(f.lesson) || anchorFacts.length >= completedLessons.length) {
        anchorFacts.push(f);
        seen.add(f.lesson);
      }
    }
    while (anchorFacts.length < 5 && shuffledFacts.length > anchorFacts.length) {
      const next = shuffledFacts[anchorFacts.length];
      if (!anchorFacts.includes(next)) anchorFacts.push(next);
    }

    const topicSummaries = completedLessons.map(l => {
      const summary = l.sections.find(s => s.type === "summary");
      return `Lesson: "${l.title}"\nKey facts:\n${summary ? summary.points.map(p => "- " + p).join("\n") : "(no summary)"}`;
    }).join("\n\n");

    const anchorList = anchorFacts.map((f, i) => `Q${i+1} must test this specific fact from "${f.lesson}": ${f.fact}`).join("\n");

    const prompt = `You are a USMLE Step 1 question writer. The student has studied these lessons:\n\n${topicSummaries}\n\nWrite exactly 5 multiple-choice questions. Each question MUST test a DIFFERENT specific fact. Here is exactly which fact each question must test — do not deviate:\n${anchorList}\n\nRules:\n- Write a short clinical patient scenario for each question\n- 4 answer options, one correct\n- The 3 wrong options must be plausible but clearly wrong for a specific reason\n- Beginner-friendly language — no assumed prior knowledge\n- Respond ONLY with a raw JSON array, no markdown, no text outside the array\n\nFormat: [{"topic":"short label","q":"question","options":["A","B","C","D"],"correct":0,"explanation":"explanation"}]`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message || "API error");
      const raw = data.content?.map(c => c.text || "").join("") || "";
      const jsonMatch = raw.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error("No JSON array found in response");
      const parsed = JSON.parse(jsonMatch[0]);
      if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("Empty question array");
      // Validate each question has required fields
      parsed.forEach((q, i) => {
        if (!q.q || !Array.isArray(q.options) || q.options.length < 2 || q.correct === undefined || !q.explanation)
          throw new Error(`Question ${i+1} is malformed`);
      });
      setPracticeQuiz(parsed.map(q => {
        // Shuffle options while tracking the correct answer
        const indices = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
        return {
          ...q,
          options: indices.map(i => q.options[i]),
          correct: indices.indexOf(q.correct),
        };
      }));
      setPracticeState({ current: 0, answers: [], done: false });
    } catch (e) {
      setPracticeError("Couldn't generate questions — " + (e.message || "unknown error") + ". Tap to retry.");
    }
    setPracticeLoading(false);
  };

  const answerPractice = (idx) => {
    const newA = [...practiceState.answers, idx];
    if (practiceState.current + 1 >= practiceQuiz.length) {
      setPracticeState({ current: practiceState.current + 1, answers: newA, done: true });
    } else {
      setPracticeState({ ...practiceState, current: practiceState.current + 1, answers: newA });
    }
  };

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim(); setChatInput("");
    const history = [...chat, { role: "user", content: userMsg }]; setChat(history); setChatLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: `You are a rigorous medical school professor teaching USMLE Step 1. The student is studying: "${lesson?.title}". Be direct, precise, clinically grounded. Use numbered steps for mechanisms. Correct misunderstandings clearly. Student is a complete beginner.`,
          messages: history.map(m => ({ role: m.role, content: m.content })) })
      });
      const data = await res.json();
      setChat([...history, { role: "assistant", content: data.content?.map(c => c.text || "").join("") || "Error." }]);
    } catch { setChat([...history, { role: "assistant", content: "Connection error. Please try again." }]); }
    setChatLoading(false);
  };

  const onTerm = useCallback((term) => { setActivePopup(term); }, []);

  const calloutStyles = {
    info:     { bg: T.blueSoft, border: T.blue, label: "NOTE",                lc: T.blue },
    clinical: { bg: T.sageSoft, border: T.sage, label: "CLINICAL CONNECTION", lc: T.sage },
    pearl:    { bg: T.goldSoft, border: T.gold, label: "STEP 1 PEARL",        lc: T.gold },
    warning:  { bg: T.claySoft, border: T.clay, label: "WATCH OUT",           lc: T.clay },
  };

  const renderSection = (sec, i) => {
    if (sec.type === "summary") return (
      <div key={i} style={{ background: T.ink, borderRadius: 10, padding: "22px 20px", marginBottom: 28 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#a0c49a", fontFamily: T.font, fontWeight: 700, marginBottom: 16 }}>Lesson Summary — Know These Cold</div>
        {sec.points.map((p, pi) => (
          <div key={pi} style={{ display: "flex", gap: 12, marginBottom: 11, lineHeight: 1.65, color: "#ede7d9", fontFamily: T.font }}>
            <span style={{ color: "#a0c49a", flexShrink: 0, fontWeight: 600, marginTop: 1 }}>→</span>
            <AnnotatedText text={p} onTerm={onTerm} style={{ fontSize: 16 }} />
          </div>
        ))}
      </div>
    );
    if (sec.type === "table") return (
      <div key={i} style={{ marginBottom: 28 }}>
        {sec.heading && <h2 style={{ fontFamily: T.font, fontSize: 19, color: T.ink, margin: "0 0 12px", fontWeight: 600 }}>{sec.heading}</h2>}
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", borderRadius: 8, border: `1px solid ${T.border}` }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: T.font, fontSize: 14, minWidth: 300 }}>
            {sec.rows.map((row, ri) => (
              <tr key={ri} style={{ background: ri === 0 ? T.ink : ri % 2 === 0 ? T.bgDeep : T.surface, borderBottom: `1px solid ${T.border}` }}>
                {row.map((cell, ci) => (
                  <td key={ci} style={{ padding: "11px 13px", color: ri === 0 ? "#ede7d9" : ci === 0 ? T.inkMid : T.ink, fontWeight: ri === 0 ? 600 : ci === 0 ? 600 : 500, fontSize: ri === 0 ? 12 : 14, letterSpacing: ri === 0 ? 0.5 : 0, textTransform: ri === 0 ? "uppercase" : "none", lineHeight: 1.5 }}>{cell}</td>
                ))}
              </tr>
            ))}
          </table>
        </div>
      </div>
    );
    if (sec.type === "callout") {
      const cs = calloutStyles[sec.variant] || calloutStyles.info;
      return (
        <div key={i} style={{ background: cs.bg, borderLeft: `4px solid ${cs.border}`, borderRadius: "0 8px 8px 0", padding: "15px 17px", marginBottom: 24 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: cs.lc, fontFamily: T.font, fontWeight: 700, marginBottom: 7 }}>{cs.label}</div>
          {sec.heading && <div style={{ fontFamily: T.font, fontSize: 17, fontWeight: 600, color: T.ink, marginBottom: 7 }}>{sec.heading}</div>}
          <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 16, lineHeight: 1.85, color: T.inkMid }}>
            {sec.body.split("\n\n").map((para, pi) => (
              <p key={pi} style={{ margin: "0 0 10px", whiteSpace: "pre-line" }}>
                <AnnotatedText text={para} onTerm={onTerm} />
              </p>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div key={i} style={{ marginBottom: 30 }}>
        {sec.heading && <h2 style={{ fontFamily: T.font, fontSize: 20, color: T.ink, margin: "0 0 14px", fontWeight: 600, paddingBottom: 10, borderBottom: `2px solid ${T.border}` }}>{sec.heading}</h2>}
        <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 17, lineHeight: 2.0, color: T.inkMid }}>
          {sec.body.split("\n\n").map((para, pi) => (
            <p key={pi} style={{ margin: "0 0 14px" }}>
              <AnnotatedText text={para} onTerm={onTerm} />
            </p>
          ))}
        </div>
      </div>
    );
  };

  // Dictionary view
  const filteredTerms = seenTerms
    .filter(t => GLOSSARY[t])
    .filter(t => t.toLowerCase().includes(dictSearch.toLowerCase()) || GLOSSARY[t].def.toLowerCase().includes(dictSearch.toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

  const catColors = { "Cell Biology": T.sage, "Chemistry": T.blue, "Physiology": T.gold, "Clinical Med": T.clay, "Pharmacology": "#6b3d8a", "Biochemistry": "#2c6b5a", "Molecular Bio": "#3d5c8a", "Immunology": "#7a4a2e", "GI Physiology": "#4a6b2c", "Endocrinology": "#8a5c1e" };

  const RecallView = () => {
    if (!reviewSession) return (
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px 80px" }}>
        <div style={{ fontFamily: T.font, fontSize: 24, fontWeight: 700, color: T.ink, marginBottom: 6 }}>Daily Review</div>
        <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 15, color: T.inkLight, marginBottom: 28 }}>Spaced repetition — items surface at increasing intervals until permanently retained.</div>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.ink }}>Due Today <span style={{ background: dueToday.length > 0 ? T.clay : T.sage, color: "#fff", fontSize: 12, fontWeight: 700, padding: "2px 9px", borderRadius: 12, marginLeft: 8 }}>{dueToday.length}</span></div>
            {dueToday.length > 0 && <button onClick={startReview} style={{ background: T.sage, color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontFamily: T.font, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Start Review →</button>}
          </div>
          {dueToday.length === 0 ? <div style={{ background: T.sageSoft, borderRadius: 8, padding: "18px 16px", fontFamily: T.font, fontSize: 15, color: T.sage, fontWeight: 600 }}>✓ All caught up! No items due today.</div>
            : <div style={{ background: T.claySoft, borderRadius: 8, padding: "14px 16px", fontFamily: T.font, fontSize: 14, color: T.clay, fontWeight: 600 }}>{dueToday.length} item{dueToday.length !== 1 ? "s" : ""} need review.</div>}
        </div>
        {upcoming.length > 0 && (
          <div>
            <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 16, color: T.ink, marginBottom: 14 }}>Coming Up</div>
            {upcoming.map(item => {
              const daysAway = daysBetween(today, item.nextReview);
              return (
                <div key={item.id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "13px 15px", marginBottom: 8, display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ flexShrink: 0, minWidth: 44, textAlign: "center" }}>
                    <div style={{ fontFamily: T.font, fontSize: 18, fontWeight: 700, color: T.blue }}>+{daysAway}</div>
                    <div style={{ fontFamily: T.font, fontSize: 10, color: T.inkLight, textTransform: "uppercase", letterSpacing: 1 }}>day{daysAway !== 1 ? "s" : ""}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: T.font, fontSize: 11, color: T.inkLight, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{item.lessonTitle}</div>
                    <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, color: T.inkMid, lineHeight: 1.6 }}>{item.text}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {recallItems.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: T.inkLight }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📚</div>
            <div style={{ fontFamily: T.font, fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No recall items yet</div>
            <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, lineHeight: 1.6 }}>Complete a lesson and mark it done — summary points are added automatically.</div>
          </div>
        )}
      </div>
    );

    if (reviewSession.done) {
      const correct = reviewSession.results.filter(r => r.remembered).length;
      return (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px 80px" }}>
          <div style={{ textAlign: "center", padding: "28px 20px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, marginBottom: 24 }}>
            <div style={{ fontFamily: T.font, fontSize: 44, fontWeight: 700, color: T.sage }}>{correct}/{reviewSession.results.length}</div>
            <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 16, color: T.inkLight, marginTop: 6 }}>reviewed today</div>
          </div>
          <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 15, color: T.ink, marginBottom: 14 }}>Session Results</div>
          {reviewSession.results.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "12px 14px", background: T.surface, border: `1px solid ${T.border}`, borderLeft: `4px solid ${r.remembered ? T.sage : T.clay}`, borderRadius: "0 8px 8px 0", marginBottom: 8 }}>
              <span style={{ flexShrink: 0, fontSize: 16 }}>{r.remembered ? "✓" : "✗"}</span>
              <div>
                <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 13, color: T.inkMid, lineHeight: 1.5, marginBottom: 3 }}>{r.item.question || r.item.text.split(/[:—→]/)[0].trim()}</div>
                <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 12, color: T.inkLight, lineHeight: 1.5 }}>{r.item.answer || r.item.text}</div>
              </div>
            </div>
          ))}
          <button onClick={() => setReviewSession(null)} style={{ background: T.sage, color: "#fff", border: "none", borderRadius: 8, padding: "13px 0", fontFamily: T.font, fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%", marginTop: 16 }}>Done</button>
        </div>
      );
    }

    const currentItem = reviewSession.items[reviewSession.current];
    const prog = reviewSession.current / reviewSession.items.length;
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 16px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: T.font, fontSize: 13, color: T.inkLight, marginBottom: 8 }}>
          <span>Card {reviewSession.current + 1} of {reviewSession.items.length}</span>
          <span style={{ color: T.sage, fontWeight: 700 }}>{Math.round(prog * 100)}%</span>
        </div>
        <div style={{ height: 4, background: T.bgDeep, borderRadius: 2, marginBottom: 24 }}>
          <div style={{ width: `${prog * 100}%`, height: "100%", background: T.sage, borderRadius: 2, transition: "width 0.3s" }} />
        </div>
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "28px 20px", marginBottom: 20, minHeight: 180 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontFamily: T.font, fontSize: 11, color: T.inkLight, letterSpacing: 2, textTransform: "uppercase" }}>{currentItem.lessonTitle}</div>
            <div style={{ fontFamily: T.font, fontSize: 10, color: reviewSession.revealed ? T.sage : T.blue, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{reviewSession.revealed ? "Answer" : "Question"}</div>
          </div>
          {!reviewSession.revealed ? (
            <div>
              <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 19, color: T.ink, lineHeight: 1.65, marginBottom: 16 }}>
                {currentItem.question || "Think back to this lesson — what can you recall about this concept?"}
              </div>
              {!currentItem.question && (
                <div style={{ fontFamily: T.font, fontSize: 13, fontWeight: 600, color: T.inkLight, background: T.bgDeep, borderRadius: 6, padding: "8px 12px", display: "inline-block" }}>
                  Topic: {currentItem.text.split(/[=:→—]/)[0].trim()}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{ fontFamily: T.font, fontSize: 12, color: T.inkLight, marginBottom: 10, fontWeight: 600 }}>The answer:</div>
              <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 17, color: T.ink, lineHeight: 1.8 }}>{currentItem.answer || currentItem.text}</div>
            </div>
          )}
        </div>
        {!reviewSession.revealed
          ? <button onClick={revealCard} style={{ background: T.ink, color: "#f5f0e8", border: "none", borderRadius: 8, padding: "14px 0", fontFamily: T.font, fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%" }}>Reveal Answer</button>
          : <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => gradeCard(false)} style={{ flex: 1, background: T.claySoft, color: T.clay, border: `1.5px solid ${T.clay}`, borderRadius: 8, padding: "14px 0", fontFamily: T.font, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>✗ Missed</button>
              <button onClick={() => gradeCard(true)} style={{ flex: 1, background: T.sageSoft, color: T.sage, border: `1.5px solid ${T.sage}`, borderRadius: 8, padding: "14px 0", fontFamily: T.font, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>✓ Got it</button>
            </div>
        }
        <div style={{ fontFamily: T.font, fontSize: 12, color: T.inkLight, textAlign: "center", marginTop: 14 }}>
          Reviewed {currentItem.reviewCount} time{currentItem.reviewCount !== 1 ? "s" : ""} · Next interval if correct: {INTERVALS[Math.min(currentItem.intervalIndex + 1, INTERVALS.length - 1)]} days
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: T.bg, color: T.ink, fontFamily: T.font, overflow: "hidden", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        html, body { margin: 0; padding: 0; overscroll-behavior: none; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-track { background: ${T.bgDeep}; } ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 2px; }
        .nav-l { cursor: pointer; padding: 10px 12px; border-radius: 6px; transition: background 0.12s; border-left: 3px solid transparent; }
        .nav-l:active { background: ${T.bgDeep}; }
        .nav-l.active { background: ${T.bgDeep}; border-left-color: ${T.sage}; }
        .tb { background: none; border: none; color: ${T.inkLight}; padding: 8px 12px; font-family: ${T.font}; font-size: 13px; font-weight: 600; cursor: pointer; border-radius: 20px; transition: all 0.12s; white-space: nowrap; }
        .tb.on { background: ${T.sage}; color: #fff; }
        .bp { background: ${T.sage}; color: #fff; border: none; padding: 14px 28px; font-family: ${T.font}; font-size: 15px; font-weight: 700; cursor: pointer; border-radius: 8px; width: 100%; transition: opacity 0.12s; }
        .bp:active { opacity: 0.8; }
        .bo { background: transparent; color: ${T.sage}; border: 1.5px solid ${T.sage}; padding: 12px 24px; font-family: ${T.font}; font-size: 15px; font-weight: 600; cursor: pointer; border-radius: 8px; }
        .qo { background: ${T.surface}; border: 1.5px solid ${T.border}; color: ${T.ink}; padding: 14px; border-radius: 8px; cursor: pointer; font-family: ${T.font}; font-size: 16px; font-weight: 600; text-align: left; transition: all 0.12s; width: 100%; margin-bottom: 10px; line-height: 1.55; }
        .qo:active { border-color: ${T.sage}; background: ${T.sageSoft}; }
        .ci { background: ${T.surface}; border: 1.5px solid ${T.border}; color: ${T.ink}; padding: 12px 14px; font-family: ${T.font}; font-size: 16px; font-weight: 600; border-radius: 8px; width: 100%; outline: none; -webkit-appearance: none; }
        .ci:focus { border-color: ${T.sage}; }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 40; }
        .sidebar { position: fixed; top: 0; left: 0; bottom: 0; width: min(82vw, 300px); background: ${T.surface}; border-right: 1px solid ${T.border}; z-index: 50; display: flex; flex-direction: column; transform: translateX(-100%); transition: transform 0.28s cubic-bezier(.4,0,.2,1); }
        .sidebar.open { transform: translateX(0); }
        .dictsidebar { position: fixed; top: 0; right: 0; bottom: 0; width: min(88vw, 360px); background: ${T.surface}; border-left: 1px solid ${T.border}; z-index: 50; display: flex; flex-direction: column; transform: translateX(100%); transition: transform 0.28s cubic-bezier(.4,0,.2,1); }
        .dictsidebar.open { transform: translateX(0); }
        .fade { animation: fu 0.2s ease; }
        @keyframes fu { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .dict-item { padding: 13px 14px; border-bottom: 1px solid ${T.border}; cursor: pointer; transition: background 0.1s; }
        .dict-item:active { background: ${T.bgDeep}; }
      `}</style>

      {/* POPUP */}
      {activePopup && <TermPopup term={activePopup} onClose={() => setActivePopup(null)} onAddToDictionary={addTermToDictionary} alreadySeen={seenTerms.includes(activePopup)} />}

      {/* SIDEBAR OVERLAY */}
      {(sidebarOpen || dictOpen) && <div className="overlay" onClick={() => { setSidebarOpen(false); setDictOpen(false); }} />}

      {/* LEFT SIDEBAR — nav */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div style={{ padding: "16px 16px 12px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: T.font, fontSize: 17, color: T.ink, fontWeight: 700 }}>MedSchool</div>
            <div style={{ fontSize: 11, color: T.inkLight, letterSpacing: 1, textTransform: "uppercase", fontFamily: T.font, marginTop: 2, fontWeight: 600 }}>USMLE Step 1 · 18 Months</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", color: T.inkLight, fontSize: 24, cursor: "pointer", padding: "4px 8px", lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.inkLight, fontFamily: T.font, marginBottom: 6 }}>
            <span style={{ fontWeight: 600 }}>Progress</span><span style={{ color: T.sage, fontWeight: 700 }}>{progress}%</span>
          </div>
          <div style={{ height: 5, background: T.bgDeep, borderRadius: 3 }}>
            <div style={{ width: `${progress}%`, height: "100%", background: T.sage, borderRadius: 3, transition: "width 0.4s" }} />
          </div>
          <div style={{ fontSize: 11, color: T.inkLight, fontFamily: T.font, marginTop: 5, fontWeight: 600 }}>{completed.length} / {totalLessons} lessons complete</div>
        </div>
        {dueToday.length > 0 && (
          <div onClick={() => { setView("recall"); setSidebarOpen(false); }} style={{ margin: "12px 12px 0", background: T.claySoft, borderRadius: 8, padding: "11px 14px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: T.font, fontSize: 13, fontWeight: 700, color: T.clay }}>🔁 Daily Review</div>
            <span style={{ background: T.clay, color: "#fff", fontSize: 12, fontWeight: 700, padding: "2px 9px", borderRadius: 12 }}>{dueToday.length}</span>
          </div>
        )}
        <div style={{ flex: 1, overflowY: "auto", padding: "10px 8px", WebkitOverflowScrolling: "touch" }}>
          {CURRICULUM.map(phase => (
            <div key={phase.phase} style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: phase.phaseColor, padding: "6px 8px 6px", fontFamily: T.font, fontWeight: 700 }}>Phase {phase.phase} · {phase.phaseTitle}</div>
              {phase.units.map(unit => (
                <div key={unit.id} style={{ marginBottom: 6 }}>
                  <div style={{ fontSize: 12, color: T.inkLight, padding: "3px 8px 5px", fontFamily: T.font, fontWeight: 600 }}>{unit.title}</div>
                  {unit.lessons.map(l => (
                    <div key={l.id} className={`nav-l ${activeLessonId === l.id && view !== "recall" && view !== "dict" ? "active" : ""}`}
                      onClick={() => !l.locked && openLesson(l.id)}
                      style={{ opacity: l.locked ? 0.35 : 1, cursor: l.locked ? "default" : "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 12, color: completed.includes(l.id) ? T.sage : T.border, flexShrink: 0, fontWeight: 700 }}>{completed.includes(l.id) ? "✓" : "○"}</span>
                      <span style={{ fontFamily: T.font, fontSize: 14, fontWeight: 600, color: T.inkMid, lineHeight: 1.4 }}>
                        {l.title}{l.locked && <span style={{ fontSize: 11, color: T.inkLight, fontWeight: 600 }}> (soon)</span>}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDEBAR — dictionary */}
      <div className={`dictsidebar ${dictOpen ? "open" : ""}`}>
        <div style={{ padding: "16px 16px 12px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: T.font, fontSize: 16, color: T.ink, fontWeight: 700 }}>My Dictionary</div>
            <div style={{ fontSize: 11, color: T.inkLight, fontFamily: T.font, fontWeight: 600, marginTop: 2 }}>{seenTerms.filter(t => GLOSSARY[t]).length} terms collected</div>
          </div>
          <button onClick={() => setDictOpen(false)} style={{ background: "none", border: "none", color: T.inkLight, fontSize: 24, cursor: "pointer", padding: "4px 8px", lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: "10px 12px", borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
          <input value={dictSearch} onChange={e => setDictSearch(e.target.value)} placeholder="Search terms…"
            style={{ width: "100%", background: T.bgDeep, border: `1px solid ${T.border}`, borderRadius: 7, padding: "9px 12px", fontFamily: T.font, fontSize: 14, fontWeight: 600, color: T.ink, outline: "none" }} />
        </div>
        <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
          {filteredTerms.length === 0 ? (
            <div style={{ padding: "32px 16px", textAlign: "center", color: T.inkLight }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📖</div>
              <div style={{ fontFamily: T.font, fontSize: 14, fontWeight: 600, lineHeight: 1.6 }}>
                {seenTerms.length === 0 ? "Tap any highlighted word in a lesson to add it here." : "No terms match your search."}
              </div>
            </div>
          ) : filteredTerms.map(term => {
            const entry = GLOSSARY[term];
            const cc = catColors[entry.cat] || T.blue;
            return (
              <div key={term} className="dict-item" onClick={() => setActivePopup(term)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
                  <div style={{ fontFamily: T.font, fontSize: 15, fontWeight: 700, color: T.ink }}>{term}</div>
                  <div style={{ background: cc + "22", color: cc, fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", padding: "2px 7px", borderRadius: 4, flexShrink: 0, marginLeft: 8 }}>{entry.cat}</div>
                </div>
                <div style={{ fontFamily: T.font, fontSize: 13, fontWeight: 500, color: T.inkLight, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{entry.def}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TOP BAR */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0, zIndex: 10 }}>
        <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", color: T.inkMid, cursor: "pointer", fontSize: 21, padding: "4px 6px", lineHeight: 1, flexShrink: 0 }}>☰</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, color: T.inkLight, fontFamily: T.font, fontWeight: 600, letterSpacing: 0.3, textTransform: "uppercase" }}>
            {view === "recall" ? "Spaced Repetition" : view === "dict" ? "My Dictionary" : lesson?.subtitle || "—"}
          </div>
          <div style={{ fontFamily: T.font, fontSize: 15, fontWeight: 700, color: T.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {view === "recall" ? "Daily Review" : view === "dict" ? `${seenTerms.filter(t => GLOSSARY[t]).length} terms` : lesson?.title || "Select a lesson"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {dueToday.length > 0 && view !== "recall" && (
            <button onClick={() => setView("recall")} style={{ background: T.claySoft, border: "none", borderRadius: 8, padding: "6px 10px", fontFamily: T.font, fontSize: 12, fontWeight: 700, color: T.clay, cursor: "pointer", flexShrink: 0 }}>
              🔁 {dueToday.length}
            </button>
          )}
          <button onClick={() => setDictOpen(true)} style={{ background: T.blueSoft, border: "none", borderRadius: 8, padding: "6px 10px", fontFamily: T.font, fontSize: 12, fontWeight: 700, color: T.blue, cursor: "pointer", flexShrink: 0 }}>
            📖 {seenTerms.filter(t => GLOSSARY[t]).length}
          </button>
        </div>
      </div>

      {/* TAB BAR */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "5px 8px", display: "flex", gap: 2, flexShrink: 0, overflowX: "auto" }}>
        {[["lesson","📖 Lecture"],["quiz","✏️ Self-Test"],["practice","🎯 Practice"],["tutor","💬 Professor"],["recall","🔁 Review" + (dueToday.length > 0 ? ` (${dueToday.length})` : "")]].map(([v, lbl]) => (
          <button key={v} className={`tb ${view === v ? "on" : ""}`} onClick={() => { setView(v); if (v !== "recall") setReviewSession(null); if (v === "practice" && !practiceQuiz && !practiceLoading && completed.length > 0) generatePracticeQuiz(); }}>{lbl}</button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>

        {/* LESSON */}
        {view === "lesson" && lesson && (
          <div className="fade" style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 80px" }}>
            <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${T.border}` }}>
              <div style={{ display: "inline-block", background: T.sageSoft, color: T.sage, fontSize: 11, fontFamily: T.font, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", padding: "4px 11px", borderRadius: 4, marginBottom: 12 }}>{lesson.badge}</div>
              <h1 style={{ fontFamily: T.font, fontSize: "clamp(22px,5vw,34px)", color: T.ink, fontWeight: 700, marginBottom: 10, lineHeight: 1.2 }}>{lesson.title}</h1>
              <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 13, color: T.inkLight }}>📖 {lesson.source}</div>
              <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 13, color: T.inkLight, marginTop: 3 }}>⏱ {lesson.readTime} read</div>
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, color: T.blue, fontFamily: T.font, fontWeight: 600 }}>💡 Tap any</span>
                <span style={{ borderBottom: `2px dotted ${T.blue}`, color: T.blue, fontSize: 11, fontFamily: T.font, fontWeight: 600 }}>underlined word</span>
                <span style={{ fontSize: 11, color: T.blue, fontFamily: T.font, fontWeight: 600 }}>to define it</span>
              </div>
            </div>
            {lesson.sections.map(renderSection)}
            <div style={{ textAlign: "center", paddingTop: 28, borderTop: `1px solid ${T.border}` }}>
              {completed.includes(activeLessonId) ? (
                <div>
                  <div style={{ color: T.sage, fontFamily: T.font, fontSize: 14, fontWeight: 700, marginBottom: 14 }}>✓ Lesson completed — summary added to recall schedule</div>
                  <button className="bo" onClick={() => setView("quiz")}>Review Self-Test →</button>
                </div>
              ) : (
                <>
                  <p style={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, color: T.inkLight, marginBottom: 14 }}>Finished? Test yourself — summary points will auto-add to your recall schedule.</p>
                  <button className="bp" onClick={markComplete}>Mark Complete & Take Self-Test →</button>
                </>
              )}
            </div>
          </div>
        )}

        {/* QUIZ */}
        {view === "quiz" && lesson?.quiz && (
          <div className="fade" style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px 80px" }}>
            <div style={{ fontFamily: T.font, fontSize: 24, fontWeight: 700, color: T.ink, marginBottom: 4 }}>Self-Test</div>
            <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, color: T.inkLight, marginBottom: 24 }}>{lesson.title}</div>
            {!quizState.done ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: T.font, fontSize: 13, color: T.inkLight, marginBottom: 8 }}>
                  <span style={{ fontWeight: 600 }}>Question {quizState.current + 1} of {lesson.quiz.length}</span>
                  <span style={{ color: T.sage, fontWeight: 700 }}>{Math.round((quizState.current / lesson.quiz.length) * 100)}%</span>
                </div>
                <div style={{ height: 4, background: T.bgDeep, borderRadius: 2, marginBottom: 24 }}>
                  <div style={{ width: `${(quizState.current / lesson.quiz.length) * 100}%`, height: "100%", background: T.sage, borderRadius: 2, transition: "width 0.3s" }} />
                </div>
                <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 16, lineHeight: 1.8, color: T.ink, marginBottom: 22, padding: "16px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8 }}>
                  {lesson.quiz[quizState.current].q}
                </div>
                {lesson.quiz[quizState.current].options.map((opt, i) => (
                  <button key={i} className="qo" onClick={() => answerQuiz(i)}>
                    <span style={{ fontWeight: 700, color: T.sage, marginRight: 10, fontSize: 14 }}>{["A","B","C","D"][i]}.</span>{opt}
                  </button>
                ))}
              </>
            ) : (
              <>
                <div style={{ textAlign: "center", marginBottom: 24, padding: "22px 16px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10 }}>
                  <div style={{ fontFamily: T.font, fontSize: 44, fontWeight: 700, color: T.sage }}>{quizState.answers.filter((a, i) => a === lesson.quiz[i].correct).length} / {lesson.quiz.length}</div>
                  <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, color: T.inkLight, marginTop: 6 }}>{quizState.answers.filter((a, i) => a === lesson.quiz[i].correct).length === lesson.quiz.length ? "Perfect. You're ready to continue." : "Review explanations below, then ask the Professor anything unclear."}</div>
                </div>
                {lesson.quiz.map((q, i) => {
                  const ok = quizState.answers[i] === q.correct;
                  return (
                    <div key={i} style={{ marginBottom: 16, padding: "16px", background: T.surface, border: `1px solid ${T.border}`, borderLeft: `4px solid ${ok ? T.sage : T.clay}`, borderRadius: "0 8px 8px 0" }}>
                      <div style={{ fontFamily: T.font, fontSize: 11, color: T.inkLight, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, fontWeight: 700 }}>Q{i+1} · {ok ? "Correct ✓" : "Incorrect"}</div>
                      <p style={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, lineHeight: 1.7, color: T.inkMid, marginBottom: 10 }}>{q.q}</p>
                      {!ok && <div style={{ fontFamily: T.font, fontSize: 13, color: T.clay, marginBottom: 5, fontWeight: 700 }}>Your answer: {q.options[quizState.answers[i]]}</div>}
                      <div style={{ fontFamily: T.font, fontSize: 13, color: T.sage, fontWeight: 700, marginBottom: 10 }}>✓ {q.options[q.correct]}</div>
                      <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, color: T.inkMid, lineHeight: 1.8, borderTop: `1px solid ${T.border}`, paddingTop: 10 }}>{q.explanation}</div>
                    </div>
                  );
                })}
                <div style={{ display: "flex", gap: 10, flexDirection: "column", marginTop: 20 }}>
                  <button className="bp" onClick={() => setView("tutor")}>Ask Professor →</button>
                  <button className="bo" onClick={() => setQuizState({ current: 0, answers: [], done: false })} style={{ width: "100%" }}>Retake Quiz</button>
                </div>
              </>
            )}
          </div>
        )}

        {/* TUTOR */}
        {view === "tutor" && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", maxWidth: 720, margin: "0 auto", width: "100%" }}>
            <div style={{ padding: "20px 16px 12px" }}>
              <div style={{ fontFamily: T.font, fontSize: 22, fontWeight: 700, color: T.ink }}>Ask the Professor</div>
              <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, color: T.inkLight, marginTop: 3 }}>Context: {lesson?.title || "—"}</div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "0 16px", WebkitOverflowScrolling: "touch" }}>
              {chat.length === 0 && (
                <div style={{ padding: "16px 0" }}>
                  <p style={{ fontFamily: T.font, fontWeight: 600, color: T.inkLight, fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>Ask anything about the current lesson.</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {["Why does BCL-2 matter clinically?","Explain SGLT1 vs SGLT2 again","How does ORT save lives in cholera?"].map(s => (
                      <button key={s} onClick={() => setChatInput(s)} style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.inkMid, padding: "12px 14px", borderRadius: 8, fontFamily: T.font, fontWeight: 600, fontSize: 14, cursor: "pointer", textAlign: "left" }}>{s}</button>
                    ))}
                  </div>
                </div>
              )}
              {chat.map((msg, i) => (
                <div key={i} className="fade" style={{ marginBottom: 14, display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 33, height: 33, borderRadius: "50%", background: msg.role === "user" ? T.bgDeep : T.sageSoft, border: `1px solid ${msg.role === "user" ? T.border : T.sage}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, fontFamily: T.font, color: msg.role === "user" ? T.inkMid : T.sage, flexShrink: 0 }}>
                    {msg.role === "user" ? "Y" : "P"}
                  </div>
                  <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px", flex: 1, fontFamily: T.font, fontWeight: 600, fontSize: 16, lineHeight: 1.9, color: T.inkMid, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && <div style={{ fontFamily: T.font, fontSize: 13, color: T.inkLight, padding: "8px 43px", fontWeight: 600 }}>Professor is thinking…</div>}
              <div ref={chatEndRef} style={{ height: 16 }} />
            </div>
            <div style={{ padding: "10px 16px 16px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 8, background: T.bg }}>
              <input className="ci" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendChat()} placeholder="Ask your question…" />
              <button onClick={sendChat} disabled={chatLoading} style={{ background: T.sage, border: "none", color: "#fff", borderRadius: 8, padding: "0 18px", fontFamily: T.font, fontSize: 14, fontWeight: 700, cursor: "pointer", flexShrink: 0, opacity: chatLoading ? 0.6 : 1 }}>Send</button>
            </div>
          </div>
        )}

        {view === "recall" && <RecallView />}

        {/* PRACTICE — AI-generated quiz */}
        {view === "practice" && (
          <div className="fade" style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px 80px" }}>

            {/* Header */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: T.font, fontSize: 24, fontWeight: 700, color: T.ink, marginBottom: 4 }}>Practice Quiz</div>
              <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, color: T.inkLight, lineHeight: 1.6 }}>
                Fresh USMLE-style questions generated from your completed lessons. New set every round.
              </div>
            </div>

            {/* Not started yet — no completed lessons */}
            {completed.length === 0 && (
              <div style={{ textAlign: "center", padding: "48px 24px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>📚</div>
                <div style={{ fontFamily: T.font, fontSize: 17, fontWeight: 700, color: T.ink, marginBottom: 8 }}>Complete a lesson first</div>
                <div style={{ fontFamily: T.font, fontSize: 14, fontWeight: 600, color: T.inkLight, lineHeight: 1.7 }}>
                  Practice questions are generated from material you've actually studied. Finish at least one lesson and mark it complete.
                </div>
              </div>
            )}

            {/* Loading */}
            {practiceLoading && (
              <div style={{ textAlign: "center", padding: "56px 24px" }}>
                <div style={{ width: 44, height: 44, border: `3px solid ${T.border}`, borderTopColor: T.sage, borderRadius: "50%", margin: "0 auto 20px", animation: "spin 0.9s linear infinite" }} />
                <div style={{ fontFamily: T.font, fontSize: 16, fontWeight: 700, color: T.ink, marginBottom: 6 }}>Generating your questions…</div>
                <div style={{ fontFamily: T.font, fontSize: 14, fontWeight: 600, color: T.inkLight }}>Building fresh clinical vignettes from your {completed.length} completed lesson{completed.length !== 1 ? "s" : ""}.</div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {/* Error */}
            {practiceError && !practiceLoading && (
              <div style={{ background: T.claySoft, border: `1px solid ${T.clay}`, borderRadius: 10, padding: "20px", marginBottom: 20, textAlign: "center" }}>
                <div style={{ fontFamily: T.font, fontSize: 15, fontWeight: 700, color: T.clay, marginBottom: 10 }}>{practiceError}</div>
                <button onClick={generatePracticeQuiz} style={{ background: T.clay, color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontFamily: T.font, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Try Again</button>
              </div>
            )}

            {/* Active quiz */}
            {practiceQuiz && !practiceLoading && !practiceState.done && (
              <>
                {/* Progress */}
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: T.font, fontSize: 13, color: T.inkLight, fontWeight: 600, marginBottom: 8 }}>
                  <span>Question {practiceState.current + 1} of {practiceQuiz.length}</span>
                  <span style={{ color: T.blue, fontWeight: 700 }}>{practiceQuiz[practiceState.current].topic}</span>
                </div>
                <div style={{ height: 4, background: T.bgDeep, borderRadius: 2, marginBottom: 24 }}>
                  <div style={{ width: `${(practiceState.current / practiceQuiz.length) * 100}%`, height: "100%", background: T.blue, borderRadius: 2, transition: "width 0.3s" }} />
                </div>
                {/* Question */}
                <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 16, lineHeight: 1.85, color: T.ink, marginBottom: 22, padding: "18px 16px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8 }}>
                  {practiceQuiz[practiceState.current].q}
                </div>
                {/* Options */}
                {practiceQuiz[practiceState.current].options.map((opt, i) => (
                  <button key={i} className="qo" onClick={() => answerPractice(i)}>
                    <span style={{ fontWeight: 700, color: T.blue, marginRight: 10, fontSize: 14 }}>{["A","B","C","D"][i]}.</span>{opt}
                  </button>
                ))}
              </>
            )}

            {/* Results */}
            {practiceQuiz && !practiceLoading && practiceState.done && (
              <>
                {/* Score card */}
                <div style={{ textAlign: "center", padding: "28px 16px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, marginBottom: 28 }}>
                  {(() => {
                    const score = practiceState.answers.filter((a, i) => a === practiceQuiz[i].correct).length;
                    const pct = Math.round((score / practiceQuiz.length) * 100);
                    const color = pct >= 80 ? T.sage : pct >= 50 ? T.gold : T.clay;
                    return (
                      <>
                        <div style={{ fontFamily: T.font, fontSize: 52, fontWeight: 700, color }}>{score}/{practiceQuiz.length}</div>
                        <div style={{ fontFamily: T.font, fontSize: 14, fontWeight: 700, color, marginTop: 2, letterSpacing: 1, textTransform: "uppercase" }}>
                          {pct >= 80 ? "Excellent work" : pct >= 50 ? "Good effort — review below" : "Keep studying — explanations below"}
                        </div>
                        <div style={{ height: 6, background: T.bgDeep, borderRadius: 3, margin: "16px 0 0" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.6s" }} />
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Question review */}
                {practiceQuiz.map((q, i) => {
                  const userAns = practiceState.answers[i];
                  const ok = userAns === q.correct;
                  return (
                    <div key={i} style={{ marginBottom: 18, background: T.surface, border: `1px solid ${T.border}`, borderLeft: `4px solid ${ok ? T.sage : T.clay}`, borderRadius: "0 10px 10px 0", padding: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <div style={{ fontFamily: T.font, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: T.inkLight, fontWeight: 700 }}>Q{i+1} · {q.topic}</div>
                        <div style={{ fontFamily: T.font, fontSize: 12, fontWeight: 700, color: ok ? T.sage : T.clay }}>{ok ? "✓ Correct" : "✗ Incorrect"}</div>
                      </div>
                      <p style={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, lineHeight: 1.7, color: T.inkMid, marginBottom: 12 }}>{q.q}</p>
                      {!ok && (
                        <div style={{ fontFamily: T.font, fontSize: 13, color: T.clay, fontWeight: 700, marginBottom: 6 }}>
                          Your answer: {["A","B","C","D"][userAns]}. {q.options[userAns]}
                        </div>
                      )}
                      <div style={{ fontFamily: T.font, fontSize: 13, color: T.sage, fontWeight: 700, marginBottom: 12 }}>
                        ✓ {["A","B","C","D"][q.correct]}. {q.options[q.correct]}
                      </div>
                      <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 14, color: T.inkMid, lineHeight: 1.8, borderTop: `1px solid ${T.border}`, paddingTop: 12 }}>
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}

                {/* New round button */}
                <div style={{ display: "flex", gap: 10, flexDirection: "column", marginTop: 8 }}>
                  <button className="bp" onClick={generatePracticeQuiz} style={{ background: T.blue }}>
                    🎯 Generate New Questions →
                  </button>
                  <button className="bo" onClick={() => setPracticeState({ current: 0, answers: [], done: false })} style={{ width: "100%", borderColor: T.blue, color: T.blue }}>
                    Retake This Set
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {view === "lesson" && !lesson && (
          <div style={{ textAlign: "center", padding: "60px 24px", color: T.inkLight, fontFamily: T.font }}>
            <div style={{ fontSize: 22, color: T.border, marginBottom: 8, fontWeight: 700 }}>Coming Soon</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>This lesson hasn't been written yet.</div>
          </div>
        )}
      </div>
    </div>
  );
}
