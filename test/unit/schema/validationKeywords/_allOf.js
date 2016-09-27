export const allOfTests = [
  {
    'description': 'allOf',
    'schema': {
      'allOf': [
        {
          'type': 'object',
          'properties': {
            'bar': { 'type': 'integer' }
          },
          'required': ['bar']
        },
        {
          'type': 'object',
          'properties': {
            'foo': { 'type': 'string' }
          },
          'required': ['foo']
        }
      ]
    },
    'tests': [
      {
        'description': 'allOf',
        'data': { 'foo': 'baz', 'bar': 2 },
        'valid': true
      },
      {
        'description': 'mismatch second',
        'data': { 'foo': 'baz' },
        'valid': false
      },
      {
        'description': 'mismatch first',
        'data': { 'bar': 2 },
        'valid': false
      },
      {
        'description': 'wrong type',
        'data': { 'foo': 'baz', 'bar': 'quux' },
        'valid': false
      }
    ]
  },
  {
    'description': 'allOf with base schema',
    'schema': {
      'type': 'object',
      'properties': { 'bar': { 'type': 'integer' } },
      'required': ['bar'],
      'allOf': [
        {
          'type': 'object',
          'properties': {
            'foo': { 'type': 'string' }
          },
          'required': ['foo']
        },
        {
          'type': 'object',
          'properties': {
            'baz': { 'type': 'null' }
          },
          'required': ['baz']
        }
      ]
    },
    'tests': [
      {
        'description': 'valid',
        'data': { 'foo': 'quux', 'bar': 2, 'baz': null },
        'valid': true
      },
      {
        'description': 'mismatch base schema',
        'data': { 'foo': 'quux', 'baz': null },
        'valid': false
      },
      {
        'description': 'mismatch first allOf',
        'data': { 'bar': 2, 'baz': null },
        'valid': false
      },
      {
        'description': 'mismatch second allOf',
        'data': { 'foo': 'quux', 'bar': 2 },
        'valid': false
      },
      {
        'description': 'mismatch both',
        'data': { 'bar': 2 },
        'valid': false
      }
    ]
  },
  {
    'description': 'allOf simple types',
    'schema': {
      'allOf': [
        { 'type': 'integer', 'maximum': 30 },
        { 'type': 'integer', 'minimum': 20 }
      ]
    },
    'tests': [
      {
        'description': 'valid',
        'data': 25,
        'valid': true
      },
      {
        'description': 'mismatch one',
        'data': 35,
        'valid': false
      }
    ]
  }
]
