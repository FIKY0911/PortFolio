/**
 * Skill.jsx
 * =========
 * Section Skill yang menampilkan list tools/teknologi dalam bentuk card grid.
 * Digunakan di halaman Home sebagai salah satu section.
 * 
 * FITUR:
 * - Menampilkan Card component yang berisi grid tools
 * - Title "Tools saya!" dengan gradient text
 * - Background abu-abu dengan rounded corners
 * - Responsive padding dan spacing
 * 
 * PERBEDAAN dengan SkillDetail:
 * - Skill.jsx: Menampilkan card list sederhana (digunakan di Home)
 * - SkillDetail.jsx: Menampilkan detail lengkap setiap teknologi (route /skill)
 */

import { useTranslation } from 'react-i18next'
import Card from '../components/skill/fragments/Card'
import Container from '../components/Container'

const Skill = () => {
  const { t } = useTranslation()

  return (
    <Container>
      <div className='w-auto mx-auto py-10 sm:py-16 bg-gray-50 dark:bg-gray-800 px-4 sm:px-6 lg:px-8 rounded-xl transition-colors duration-300'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-4'>
            {t('skills.title')}
          </h2>
        </div>
        <Card />
      </div>
    </Container>
  )
}

export default Skill
