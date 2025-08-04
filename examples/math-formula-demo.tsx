"use client"

import { MathFormula, PHYSICS_FORMULAS } from "@/components/math-formula"

export default function MathFormulaDemo() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">ตัวอย่างการแสดงผลสูตรคณิตศาสตร์</h1>
      
      <div className="space-y-8">
        {/* Physics Formulas */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">สูตรฟิสิกส์</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="physics-formula">
              <h3 className="font-semibold mb-2">ความเร่งเฉลี่ย</h3>
              <MathFormula formula={PHYSICS_FORMULAS.averageAcceleration} display="block" subject="physics" />
              <p className="text-sm text-gray-600 mt-2">
                เมื่อ v_f คือความเร็วสุดท้าย, v_i คือความเร็วเริ่มต้น, t คือช่วงเวลา
              </p>
            </div>
            
            <div className="physics-formula">
              <h3 className="font-semibold mb-2">ความเร่งขณะใดขณะหนึ่ง</h3>
              <MathFormula formula={PHYSICS_FORMULAS.instantaneousAcceleration} display="block" subject="physics" />
              <p className="text-sm text-gray-600 mt-2">
                ความเร่งที่จุดใดจุดหนึ่งในเวลา
              </p>
            </div>
            
            <div className="physics-formula">
              <h3 className="font-semibold mb-2">ความเร็วสุดท้าย</h3>
              <MathFormula formula={PHYSICS_FORMULAS.velocityFinal} display="block" subject="physics" />
              <p className="text-sm text-gray-600 mt-2">
                สูตรสำหรับการเคลื่อนที่ด้วยความเร่งคงที่
              </p>
            </div>
            
            <div className="physics-formula">
              <h3 className="font-semibold mb-2">การกระจัด</h3>
              <MathFormula formula={PHYSICS_FORMULAS.displacement} display="block" subject="physics" />
              <p className="text-sm text-gray-600 mt-2">
                การกระจัดเมื่อเคลื่อนที่ด้วยความเร่งคงที่
              </p>
            </div>
          </div>
        </section>
        
        {/* Energy Formulas */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-green-600">สูตรพลังงาน</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="chemistry-formula">
              <h3 className="font-semibold mb-2">พลังงานจลน์</h3>
              <MathFormula formula={PHYSICS_FORMULAS.kineticEnergy} display="block" subject="chemistry" />
              <p className="text-sm text-gray-600 mt-2">
                พลังงานที่วัตถุมีเนื่องจากความเร็ว
              </p>
            </div>
            
            <div className="chemistry-formula">
              <h3 className="font-semibold mb-2">พลังงานศักย์</h3>
              <MathFormula formula={PHYSICS_FORMULAS.potentialEnergy} display="block" subject="chemistry" />
              <p className="text-sm text-gray-600 mt-2">
                พลังงานที่วัตถุมีเนื่องจากตำแหน่ง
              </p>
            </div>
          </div>
        </section>
        
        {/* Modern Physics */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-purple-600">ฟิสิกส์สมัยใหม่</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="biology-formula">
              <h3 className="font-semibold mb-2">สมการของไอน์สไตน์</h3>
              <MathFormula formula={PHYSICS_FORMULAS.einsteinEnergy} display="block" subject="biology" />
              <p className="text-sm text-gray-600 mt-2">
                ความสัมพันธ์ระหว่างมวลและพลังงาน
              </p>
            </div>
            
            <div className="biology-formula">
              <h3 className="font-semibold mb-2">พลังงานของพลังค์</h3>
              <MathFormula formula={PHYSICS_FORMULAS.planckEnergy} display="block" subject="biology" />
              <p className="text-sm text-gray-600 mt-2">
                พลังงานของโฟตอน
              </p>
            </div>
          </div>
        </section>
        
        {/* Inline Math Examples */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-orange-600">ตัวอย่างสูตรแบบ Inline</h2>
          
          <div className="formula-container">
            <p className="mb-4">
              เมื่อวัตถุเคลื่อนที่ด้วยความเร็วคงที่ <MathFormula formula="v" display="inline" /> 
              ในเวลา <MathFormula formula="t" display="inline" /> 
              ระยะทางที่เคลื่อนที่ได้คือ <MathFormula formula="s = vt" display="inline" />
            </p>
            
            <p className="mb-4">
              สำหรับการเคลื่อนที่ด้วยความเร่งคงที่ <MathFormula formula="a" display="inline" /> 
              ความเร็วจะเปลี่ยนจาก <MathFormula formula="v_i" display="inline" /> 
              เป็น <MathFormula formula="v_f = v_i + at" display="inline" />
            </p>
            
            <p>
              พลังงานทั้งหมดของระบบคือ <MathFormula formula="E = K + U" display="inline" /> 
              เมื่อ <MathFormula formula="K" display="inline" /> คือพลังงานจลน์และ 
              <MathFormula formula="U" display="inline" /> คือพลังงานศักย์
            </p>
          </div>
        </section>
        
        {/* Complex Formulas */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-red-600">สูตรซับซ้อน</h2>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="physics-formula">
              <h3 className="font-semibold mb-2">กฎของสเนลล์</h3>
              <MathFormula formula={PHYSICS_FORMULAS.snellLaw} display="block" subject="physics" />
              <p className="text-sm text-gray-600 mt-2">
                ความสัมพันธ์ระหว่างมุมตกกระทบและมุมหักเห
              </p>
            </div>
            
            <div className="physics-formula">
              <h3 className="font-semibold mb-2">สมการเลนส์</h3>
              <MathFormula formula={PHYSICS_FORMULAS.lensEquation} display="block" subject="physics" />
              <p className="text-sm text-gray-600 mt-2">
                ความสัมพันธ์ระหว่างความยาวโฟกัส ระยะวัตถุ และระยะภาพ
              </p>
            </div>
            
            <div className="physics-formula">
              <h3 className="font-semibold mb-2">สมการคลื่น</h3>
              <MathFormula formula={PHYSICS_FORMULAS.waveSpeed} display="block" subject="physics" />
              <p className="text-sm text-gray-600 mt-2">
                ความสัมพันธ์ระหว่างความเร็วคลื่น ความถี่ และความยาวคลื่น
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} 