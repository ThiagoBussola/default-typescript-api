module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  },
  clearMocks: true,
  coverageProvider: 'v8',
  coverageThreshold: {
    './src/handlers/': {
      lines: 80, // verifica se 80% das linhas foram cobertas
      functions: 90, // verifica se 90% das funções foram chamadas
      branches: 90, // verifica se passou em 90% dos condicionais (ifs)
      /**
       * verifica se 80% do código total handlers foi executado
       * diferente da cobertura das linhas, pois uma linha pode
       * ter mais de uma instrução
       */
      statements: 80
    }
  }
}
