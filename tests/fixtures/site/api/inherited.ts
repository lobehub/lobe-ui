export interface InheritedProps {
  /** A property inherited from the shared fixture contract. */
  inherited?: boolean;
}

export interface ButtonProps {
  /** Inherited even though its declaring interface shares the local root name. */
  sameNameInherited?: string;
}
