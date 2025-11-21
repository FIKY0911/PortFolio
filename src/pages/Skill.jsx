import React from 'react'
import Card from '../components/skill/fragments/Card'
import Container from '../components/Container'

const Skill = () => {
  return (
    <>
    <Container>
      <div className="w-auto mx-auto py-10 sm:py-16 bg-gray-50 px-4 sm:px-6 lg:px-8 rounded-xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-4">
            Tools saya!
          </h2>
        </div>

        <Card />
      </div>
    </Container>
    </>
  )
}

export default Skill
